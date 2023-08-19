import { MigrationInterface, QueryRunner } from 'typeorm';

import * as CitiesAreasDataJSON from './cities-areas.json';

export class CitiesAreasData1692486779262 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    CitiesAreasDataJSON.cities.forEach(async (city) => {
      await queryRunner.query(
        `INSERT INTO city (name) VALUES ('${city.name}')`,
      );
      city.areas.forEach(async (area) => {
        await queryRunner.query(
          `INSERT INTO area (name, cityId) VALUES ('${area}', (SELECT id FROM city WHERE name = '${city.name}'))`,
        );
      });
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM area`);
    await queryRunner.query(`DELETE FROM city`);
  }
}
