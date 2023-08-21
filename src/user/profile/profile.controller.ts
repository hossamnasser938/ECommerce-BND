import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
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

  @Put('data/:profile_id')
  updateProfileData(
    @Param('profile_id', ParseIntPipe) profileId: number,
    @Body() updateProfileDataDTO: UpdateProfileDataDTO,
  ) {
    return this.profileService.updateProfileData(
      profileId,
      updateProfileDataDTO,
    );
  }

  @Put('photo/:profile_id')
  @UseInterceptors(FileInterceptor('photo'))
  updateProfilePhoto(
    @Param('profile_id', ParseIntPipe) profileId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: IMAGES_VALIDATORS,
      }),
    )
    image: ExtendedMulterFile,
  ) {
    return this.profileService.updateProfilePhoto(
      profileId,
      image.storageIdentifier,
    );
  }

  @Delete('photo/:photo_id')
  removeProfilePhoto(@Param('photo_id', ParseIntPipe) photoId: number) {
    return this.profileService.removeProfilePhoto(photoId);
  }
}
