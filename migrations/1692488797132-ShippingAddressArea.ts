import { MigrationInterface, QueryRunner } from 'typeorm';

export class ShippingAddressArea1692488797132 implements MigrationInterface {
  name = 'ShippingAddressArea1692488797132';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`shipping_address\` DROP COLUMN \`area\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`shipping_address\` DROP COLUMN \`city\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`shipping_address\` ADD \`areaId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shipping_address\` ADD CONSTRAINT \`FK_27e4d4a6ee5067391bcf2fdf796\` FOREIGN KEY (\`areaId\`) REFERENCES \`area\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`shipping_address\` DROP FOREIGN KEY \`FK_27e4d4a6ee5067391bcf2fdf796\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`shipping_address\` DROP COLUMN \`areaId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`shipping_address\` ADD \`city\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shipping_address\` ADD \`area\` varchar(255) NOT NULL`,
    );
  }
}
