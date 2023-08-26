#!/bin/bash

MODULE_NAME="$1"

mkdir src/$MODULE_NAME
mkdir src/$MODULE_NAME/dtos

getModuleName() {
  echo $MODULE_NAME
}

getModuleNomeAllCaps() {
  local module_name=$(getModuleName)
  echo ${module_name//-/_} | tr '[:lower:]' '[:upper:]'
}

getModuleNameCamelCase() {
  local module_name=$(getModuleName)
  local camel_case_name=""
  IFS='-' read -ra words <<< "$module_name"
  first_word_processed=false
  for word in "${words[@]}"; do
    if [ "$first_word_processed" = false ]; then
      camel_case_name+="${word}"
      first_word_processed=true
    else
      camel_case_name+="$(tr '[:lower:]' '[:upper:]' <<< ${word:0:1})${word:1}"
    fi
  done
  echo ${camel_case_name}
}

getModuleNamePascalCase() {
  local module_name=$(getModuleName)
  local pascal_case_name=""
  IFS='-' read -ra words <<< "$module_name"
  for word in "${words[@]}"; do
    pascal_case_name+=$(tr '[:lower:]' '[:upper:]' <<< ${word:0:1})${word:1}
  done
  echo ${pascal_case_name}
}

getModuleNameSnakeCase() {
  local module_name=$(getModuleName)
  echo ${module_name//-/_}
}

##### create entity dto
echo "export class Create$(getModuleNamePascalCase)DTO {

}
" > src/$(getModuleName)/dtos/create-$(getModuleName).dto.ts

##### update entity dto
echo "import { PartialType } from '@nestjs/mapped-types';

import { Create$(getModuleNamePascalCase)DTO } from './create-$(getModuleName).dto';

export class Update$(getModuleNamePascalCase)DTO extends PartialType(Create$(getModuleNamePascalCase)DTO) {}
" > src/$(getModuleName)/dtos/update-$(getModuleName).dto.ts

#####
# abstract entity
echo "import { BaseEntity } from './base-entity.abstract';

export interface I$(getModuleNamePascalCase) extends BaseEntity {
  
}
" > src/core/entities/$(getModuleName).entity.abstract.ts

#####
# typeorm entity
echo "import { I$(getModuleNamePascalCase) } from 'src/core/entities/$(getModuleName).entity.abstract';
import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../base-entity.abstract';

@Entity({ name: '$(getModuleName)' })
export class $(getModuleNamePascalCase)Entity extends BaseEntity implements I$(getModuleNamePascalCase) {

}
" > src/core/data-layer/mysql-typeorm/entities/$(getModuleName).entity.ts

#####
# constants
echo "export const $(getModuleNomeAllCaps)_REPOSITORY_PROVIDER_TOKEN = 
  'I$(getModuleNamePascalCase)Repository';" > src/$(getModuleName)/$(getModuleName).constants.ts

#####
# abstract repository
echo "import { GenericRepository } from 'src/core/abstract-data-layer/generic-repository.abstract';
import { I$(getModuleNamePascalCase) } from 'src/core/entities/$(getModuleName).entity.abstract';
import { IUser } from 'src/core/entities/user.entity.abstract';

import { Create$(getModuleNamePascalCase)DTO } from './dtos/create-$(getModuleName).dto';

export interface I$(getModuleNamePascalCase)Repositoy<T extends I$(getModuleNamePascalCase)>
  extends GenericRepository<T> {
  createOne(
    create$(getModuleNamePascalCase)DTO: Create$(getModuleNamePascalCase)DTO,
    user: IUser
  ): Promise<T>;
}
" > src/$(getModuleName)/$(getModuleName).repository.abstract.ts

##### 
# repository
echo "import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { $(getModuleNamePascalCase)Entity } from 'src/core/data-layer/mysql-typeorm/entities/$(getModuleName).entity';
import { UserEntity } from 'src/core/data-layer/mysql-typeorm/entities/user.entity';
import { MySQLTypeORMDataLayerRepository } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.repository';
import { Repository } from 'typeorm';

import { Create$(getModuleNamePascalCase)DTO } from './dtos/create-$(getModuleName).dto';
import { I$(getModuleNamePascalCase)Repositoy } from './$(getModuleName).repository.abstract';

@Injectable()
export class $(getModuleNamePascalCase)Repository
  extends MySQLTypeORMDataLayerRepository<$(getModuleNamePascalCase)Entity>
  implements I$(getModuleNamePascalCase)Repositoy<$(getModuleNamePascalCase)Entity>
{
  constructor(
    @InjectRepository($(getModuleNamePascalCase)Entity)
    private readonly $(getModuleNameCamelCase)EntityRepo: Repository<$(getModuleNamePascalCase)Entity>,
  ) {
    super($(getModuleNameCamelCase)EntityRepo);
  }

  async createOne(
    create$(getModuleNamePascalCase)DTO: Create$(getModuleNamePascalCase)DTO,
    user: UserEntity
  ): Promise<$(getModuleNamePascalCase)Entity> {
    const {  } = create$(getModuleNamePascalCase)DTO;

    const $(getModuleNameCamelCase) = new $(getModuleNamePascalCase)Entity();

    return this.$(getModuleNameCamelCase)EntityRepo.save($(getModuleNameCamelCase));
  }
}
" > src/$(getModuleName)/$(getModuleName).repository.ts

#####
# service 
echo "import { Inject, Injectable } from '@nestjs/common';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { I$(getModuleNamePascalCase) } from 'src/core/entities/$(getModuleName).entity.abstract';
import { IUser } from 'src/core/entities/user.entity.abstract';

import { Create$(getModuleNamePascalCase)DTO } from './dtos/create-$(getModuleName).dto';
import { Update$(getModuleNamePascalCase)DTO } from './dtos/update-$(getModuleName).dto';
import { $(getModuleNomeAllCaps)_REPOSITORY_PROVIDER_TOKEN } from './$(getModuleName).constants';
import { I$(getModuleNamePascalCase)Repositoy } from './$(getModuleName).repository.abstract';

@Injectable()
export class $(getModuleNamePascalCase)Service {
  constructor(
    @Inject($(getModuleNomeAllCaps)_REPOSITORY_PROVIDER_TOKEN)
    private readonly $(getModuleNameCamelCase)Repository: I$(getModuleNamePascalCase)Repositoy<I$(getModuleNamePascalCase)>,
  ) {}

  findAll(paginationParametersDTO: PaginationParamsDTO) {
    return this.$(getModuleNameCamelCase)Repository.getAll(paginationParametersDTO);
  }

  findUserAll(
    userId: Identifier,
    paginationParametersDTO: PaginationParamsDTO,
  ) {
    return this.$(getModuleNameCamelCase)Repository.getAllByCondition(
      paginationParametersDTO,
      {
        user: { id: userId },
      },
    );
  }

  async findOneById(id: Identifier) {
    const $(getModuleNameCamelCase) = await this.$(getModuleNameCamelCase)Repository.getOneById(id);
    return $(getModuleNameCamelCase);
  }

  createOne(create$(getModuleNamePascalCase)DTO: Create$(getModuleNamePascalCase)DTO, user: IUser) {
    return this.$(getModuleNameCamelCase)Repository.createOne(
      create$(getModuleNamePascalCase)DTO,
      user,
    );
  }

  async updateOne(
    id: Identifier,
    update$(getModuleNamePascalCase)DTO: Update$(getModuleNamePascalCase)DTO,
    userId: Identifier,
  ) {
    const updated = await this.$(getModuleNameCamelCase)Repository.updateOneByCondition(
      { id, user: { id: userId } },
      update$(getModuleNamePascalCase)DTO,
    );
    return updated;
  }

  async deleteOne(id: Identifier, userId: Identifier) {
    const deleted = await this.$(getModuleNameCamelCase)Repository.deleteOneByCondition({
      id,
      user: { id: userId },
    });
    return deleted;
  }
}
" > src/$(getModuleName)/$(getModuleName).service.ts

# getModuleName getModuleNomeAllCaps getModuleNameCamelCase getModuleNamePascalCase getModuleNameSnakeCase
#####
## controller
echo "import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
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
import { updateDeleteResponse } from 'src/utils/helper-functions';

import { Create$(getModuleNamePascalCase)DTO } from './dtos/create-$(getModuleName).dto';
import { Update$(getModuleNamePascalCase)DTO } from './dtos/update-$(getModuleName).dto';
import { $(getModuleNamePascalCase)Service } from './$(getModuleName).service';

@UseGuards(AuthGuard)
@Controller('$(getModuleName)s')
export class $(getModuleNamePascalCase)Controller {
  constructor(
    @Inject($(getModuleNamePascalCase)Service)
    private readonly $(getModuleNameCamelCase)Service: $(getModuleNamePascalCase)Service,
  ) {}

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, new RolesGuard(new Reflector()))
  @Get('all')
  findAll$(getModuleNamePascalCase)(
    @Query() paginationParametersDTO: PaginationParamsDTO,
  ) {
    return this.$(getModuleNameCamelCase)Service.findAll(paginationParametersDTO);
  }

  @Get()
  findUser$(getModuleNamePascalCase)s(
    @Request() request,
    @Query() paginationParametersDTO: PaginationParamsDTO,
  ) {
    const user = request.user as IUser;
    return this.$(getModuleNameCamelCase)Service.findUserAll(
      user.id,
      paginationParametersDTO,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.$(getModuleNameCamelCase)Service.findOneById(id);
  }

  @Post()
  createOne(
    @Body() create$(getModuleNamePascalCase)DTO: Create$(getModuleNamePascalCase)DTO,
    @Request() request,
  ) {
    const user = request.user as IUser;
    return this.$(getModuleNameCamelCase)Service.createOne(
      create$(getModuleNamePascalCase)DTO,
      user,
    );
  }

  @Put(':id')
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() update$(getModuleNamePascalCase)DTO: Update$(getModuleNamePascalCase)DTO,
    @Request() request,
  ) {
    const user = request.user as IUser;
    const updatedSuccessfully = await this.$(getModuleNameCamelCase)Service.updateOne(
      id,
      update$(getModuleNamePascalCase)DTO,
      user.id,
    );
    return updateDeleteResponse(updatedSuccessfully);
  }

  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number, @Request() request) {
    const user = request.user as IUser;
    const deletedSuccessfully = await this.$(getModuleNameCamelCase)Service.deleteOne(
      id,
      user.id,
    );
    return updateDeleteResponse(deletedSuccessfully);
  }
}
" > src/$(getModuleName)/$(getModuleName).controller.ts

#####
# module
echo "import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { $(getModuleNamePascalCase)Entity } from 'src/core/data-layer/mysql-typeorm/entities/$(getModuleName).entity';

import { $(getModuleNomeAllCaps)_REPOSITORY_PROVIDER_TOKEN } from './$(getModuleName).constants';
import { $(getModuleNamePascalCase)Controller } from './$(getModuleName).controller';
import { $(getModuleNamePascalCase)Repository } from './$(getModuleName).repository';
import { $(getModuleNamePascalCase)Service } from './$(getModuleName).service';

@Module({
  imports: [
    TypeOrmModule.forFeature([$(getModuleNamePascalCase)Entity]),
  ],
  providers: [
    $(getModuleNamePascalCase)Service,
    {
      provide: $(getModuleNomeAllCaps)_REPOSITORY_PROVIDER_TOKEN,
      useClass: $(getModuleNamePascalCase)Repository,
    },
  ],
  controllers: [$(getModuleNamePascalCase)Controller],
  exports: [$(getModuleNamePascalCase)Service],
})
export class $(getModuleNamePascalCase)Module {}
" > src/$(getModuleName)/$(getModuleName).module.ts