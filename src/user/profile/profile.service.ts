import { Inject, Injectable } from '@nestjs/common';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { IProfile } from 'src/core/entities/profile-entity.abstract';
import { FileService } from 'src/file/file.service';
import { AbstractFileStorageService } from 'src/file-storage/file-storage.service.abstract';
import { FILE_STOREAGE_SERVICE_PROVIDER_TOKEN } from 'src/file-storage/fs-file-storeage.constants';

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

  async updateProfileData(
    profileId: Identifier,
    updateProfileDataDTO: UpdateProfileDataDTO,
  ) {
    const { name } = updateProfileDataDTO;

    const updated = await this.profileRepository.updateOneById(profileId, {
      name,
    });

    return !!updated;
  }

  async updateProfilePhoto(profileId: number, photoStorageIdentifier: string) {
    try {
      const profile = await this.profileRepository.getOneById(profileId);
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

  async removeProfilePhoto(photoId: Identifier) {
    const deleted = await this.fileService.deleteOne(photoId);
    return deleted;
  }
}
