import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderStatus1692572604713 implements MigrationInterface {
  name = 'AddOrderStatus1692572604713';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`status\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`status\``);
  }
}
