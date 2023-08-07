import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
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
import { updateDeleteResponse } from 'src/utils/helper-functions';

import { FavoriteService } from './favorite.service';
import { FavoriteDTO } from './models/favorite.dto';

@UseGuards(AuthGuard)
@Controller('favorites')
export class FavoriteController {
  constructor(
    @Inject(FavoriteService) private readonly favoriteService: FavoriteService,
  ) {}

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, new RolesGuard(new Reflector()))
  @Get('all')
  findAll(@Query() paginationParametersDTO: PaginationParamsDTO) {
    return this.favoriteService.findAll(paginationParametersDTO);
  }

  @Get()
  findUserAll(
    @Request() request,
    @Query() paginationParametersDTO: PaginationParamsDTO,
  ) {
    const user = request.user as IUser;
    return this.favoriteService.findUserFavorites(
      user.id,
      paginationParametersDTO,
    );
  }

  @Post('favorite')
  favorite(@Body() favoriteDTO: FavoriteDTO, @Request() request) {
    const user = request.user as IUser;
    return this.favoriteService.favorite(favoriteDTO, user.id);
  }

  @Post('unfavorite')
  async unfavorite(@Body() favoriteDTO: FavoriteDTO, @Request() request) {
    const user = request.user as IUser;
    const successfullyUnfavorited = await this.favoriteService.unfavorite(
      favoriteDTO,
      user.id,
    );

    return updateDeleteResponse(successfullyUnfavorited);
  }
}
