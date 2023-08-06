import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FavoriteDTO } from './models/favorite.dto';
import { updateDeleteResponse } from 'src/utils/helper-functions';
import { Roles } from 'src/auth/auth.decorators';
import { Role } from 'src/auth/auth.enums';
import { IUser } from 'src/core/entities/user.entity.abstract';
import { RolesGuard } from 'src/auth/roles.guard';
import { Reflector } from '@nestjs/core';

@UseGuards(AuthGuard)
@Controller('favorites')
export class FavoriteController {
  constructor(
    @Inject(FavoriteService) private favoriteService: FavoriteService,
  ) {}

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, new RolesGuard(new Reflector()))
  @Get('all')
  findAll() {
    return this.favoriteService.findAll();
  }

  @Get()
  findUserAll(@Request() request) {
    const user = request.user as IUser;
    return this.favoriteService.findUserFavorites(user.id);
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
