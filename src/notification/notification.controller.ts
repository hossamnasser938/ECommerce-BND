import {
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/auth/auth.decorators';
import { Role } from 'src/auth/auth.enums';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { IUser } from 'src/core/entities/user.entity.abstract';
import { NotificationTokenService } from 'src/notification-token/notification-token.service';
import { updateDeleteResponse } from 'src/utils/helper-functions';

import { NotificationService } from './notification.service';

@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(
    @Inject(NotificationService)
    private readonly notificationService: NotificationService,
    @Inject(NotificationTokenService)
    private readonly notificationTokenService: NotificationTokenService,
  ) {}

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, new RolesGuard(new Reflector()))
  @Get('all')
  findAllNotification(@Query() paginationParametersDTO: PaginationParamsDTO) {
    return this.notificationService.findAll(paginationParametersDTO);
  }

  @Get()
  findUserNotifications(
    @Request() request,
    @Query() paginationParametersDTO: PaginationParamsDTO,
  ) {
    const user = request.user as IUser;
    return this.notificationService.findUserAll(
      paginationParametersDTO,
      user.id,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.findOneById(id);
  }

  @Put('mark-read/:id')
  async markOneAsRead(
    @Param('id', ParseIntPipe) id: number,
    @Request() request,
  ) {
    const user = request.user as IUser;
    const updatedSuccessfully = await this.notificationService.markOneRead(
      id,
      user.id,
    );
    return updateDeleteResponse(updatedSuccessfully);
  }

  @Put('mark-read')
  async markUserAllRead(@Request() request) {
    const user = request.user as IUser;
    const updatedSuccessfully = await this.notificationService.markAllUserRead(
      user.id,
    );
    return updateDeleteResponse(updatedSuccessfully);
  }
}
