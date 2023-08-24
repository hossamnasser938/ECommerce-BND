import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  ParseFilePipe,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { IUser } from 'src/core/entities/user.entity.abstract';
import { IMAGES_VALIDATORS } from 'src/multer-wrapper/multer-wrapper.constants';
import { ExtendedMulterFile } from 'src/multer-wrapper/multer-wrapper.types';

import { UpdateProfileDataDTO } from './dtos/update-profile-data.dto';
import { ProfileService } from './profile.service';

@UseGuards(AuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(
    @Inject(ProfileService) private readonly profileService: ProfileService,
  ) {}

  @Get()
  getUserProfile(@Request() request) {
    const user = request.user as IUser;
    return this.profileService.getUserProfile(user.id);
  }

  @Put('data')
  updateProfileData(
    @Request() request,
    @Body() updateProfileDataDTO: UpdateProfileDataDTO,
  ) {
    const user = request.user as IUser;
    return this.profileService.updateProfileData(user.id, updateProfileDataDTO);
  }

  @Put('photo')
  @UseInterceptors(FileInterceptor('photo'))
  updateProfilePhoto(
    @Request() request,
    @UploadedFile(
      new ParseFilePipe({
        validators: IMAGES_VALIDATORS,
      }),
    )
    image: ExtendedMulterFile,
  ) {
    const user = request.user as IUser;
    return this.profileService.updateProfilePhoto(
      user.id,
      image.storageIdentifier,
    );
  }

  @Delete('photo')
  removeProfilePhoto(@Request() request) {
    const user = request.user as IUser;
    return this.profileService.removeProfilePhoto(user.id);
  }
}
