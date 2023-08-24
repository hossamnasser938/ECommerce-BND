import {
  Body,
  Controller,
  Get,
  Inject,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { IUser } from 'src/core/entities/user.entity.abstract';
import { updateDeleteResponse } from 'src/utils/helper-functions';

import { UpdatePreferenceDTO } from './dtos/update-preference.dto';
import { PreferenceService } from './preference.service';

@UseGuards(AuthGuard)
@Controller('preferences')
export class PreferenceController {
  constructor(
    @Inject(PreferenceService)
    private readonly preferenceService: PreferenceService,
  ) {}

  @Get()
  findOne(@Request() request) {
    const user = request.user as IUser;
    return this.preferenceService.findOneById(user.id);
  }

  @Put()
  async updateOne(
    @Body() updatePreferenceDTO: UpdatePreferenceDTO,
    @Request() request,
  ) {
    const user = request.user as IUser;
    const updatedSuccessfully = await this.preferenceService.updateOne(
      user.id,
      updatePreferenceDTO,
    );
    return updateDeleteResponse(updatedSuccessfully);
  }
}
