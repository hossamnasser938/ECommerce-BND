import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { IProfile } from 'src/core/entities/profile-entity.abstract';
import { FileService } from 'src/file/file.service';
import { AbstractFileStorageService } from 'src/file-storage/file-storage.service.abstract';
import { FILE_STOREAGE_SERVICE_PROVIDER_TOKEN } from 'src/file-storage/fs-file-storeage.constants';
import { ERROR_MESSAGES } from 'src/utils/error-messages';

import { UpdateProfileDataDTO } from './dtos/update-profile-data.dto';
import { PROFILE_REPOSITORY_PROVIDER_TOKEN } from './profile.constants';
import { IProfileRepository } from './profile.repository.abstract';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(PROFILE_REPOSITORY_PROVIDER_TOKEN)
    private readonly profileRepository: IProfileRepository<IProfile>,
    @Inject(FileService) private readonly fileService: FileService,
    @Inject(FILE_STOREAGE_SERVICE_PROVIDER_TOKEN)
    private readonly fileStorageService: AbstractFileStorageService,
  ) {}

  async getUserProfile(userId: Identifier) {
    return this.profileRepository.getUserProfile(userId);
  }

  async updateProfileData(
    userId: Identifier,
    updateProfileDataDTO: UpdateProfileDataDTO,
  ) {
    const userProfile = await this.getUserProfile(userId);

    const { name } = updateProfileDataDTO;

    const updated = await this.profileRepository.updateOneById(userProfile.id, {
      name,
    });

    return !!updated;
  }

  async updateProfilePhoto(userId: Identifier, photoStorageIdentifier: string) {
    try {
      const userProfile = await this.getUserProfile(userId);

      const profile = await this.profileRepository.getOneById(userProfile.id);
      profile.visualResource.images.forEach(async (image) => {
        await this.removeProfilePhoto(image.id);
      });
      await this.fileService.createOne(photoStorageIdentifier, profile);
      return true;
    } catch (err) {
      this.fileStorageService.deleteFile(photoStorageIdentifier);
      throw err;
    }
  }

  async removeProfilePhoto(userId: Identifier) {
    const userProfile = await this.getUserProfile(userId);
    const { images } = userProfile.visualResource;

    if (!images.length) {
      throw new NotFoundException(ERROR_MESSAGES.USER_HAS_NO_PHOTO);
    }

    const photoId = images[0].id;

    const deleted = await this.fileService.deleteOne(photoId);
    return deleted;
  }
}
