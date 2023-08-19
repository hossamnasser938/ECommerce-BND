import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1692479061225 implements MigrationInterface {
  name = 'InitialMigration1692479061225';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`file\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`storageIdentifier\` varchar(255) NOT NULL, \`visualResourceId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`visual_resource\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`visualResourceId\` int NULL, \`parentCategoryId\` int NULL, FULLTEXT INDEX \`IDX_23c05c292c439d77b0de816b50\` (\`name\`), UNIQUE INDEX \`REL_30444bc52b4ea6e3c539950dcd\` (\`visualResourceId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`amount\` int NOT NULL, \`visualResourceId\` int NULL, \`categoryId\` int NULL, FULLTEXT INDEX \`IDX_22cc43e9a74d7498546e9a63e7\` (\`name\`), FULLTEXT INDEX \`IDX_29a733971f71626611bb3808eb\` (\`description\`), UNIQUE INDEX \`REL_6147ce2b2b2ee9280d460e3a14\` (\`visualResourceId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`favorite_item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`productId\` int NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`verification_code\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`code\` varchar(255) NOT NULL, \`validUntil\` datetime NOT NULL, \`used\` tinyint NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`roles\` varchar(255) NOT NULL, \`verified\` tinyint NOT NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`shipping_address\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`city\` varchar(255) NOT NULL, \`area\` varchar(255) NOT NULL, \`street\` varchar(255) NOT NULL, \`building\` int NOT NULL, \`apartment\` int NOT NULL, \`isDefault\` tinyint NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`shippingAddressId\` int NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`cart_item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`amount\` int NOT NULL, \`productId\` int NULL, \`userId\` int NULL, \`orderId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` ADD CONSTRAINT \`FK_261e767bcc16d38cf69b4f2a0fb\` FOREIGN KEY (\`visualResourceId\`) REFERENCES \`visual_resource\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` ADD CONSTRAINT \`FK_30444bc52b4ea6e3c539950dcdf\` FOREIGN KEY (\`visualResourceId\`) REFERENCES \`visual_resource\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` ADD CONSTRAINT \`FK_9e5435ba76dbc1f1a0705d4db43\` FOREIGN KEY (\`parentCategoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product\` ADD CONSTRAINT \`FK_6147ce2b2b2ee9280d460e3a145\` FOREIGN KEY (\`visualResourceId\`) REFERENCES \`visual_resource\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product\` ADD CONSTRAINT \`FK_ff0c0301a95e517153df97f6812\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`favorite_item\` ADD CONSTRAINT \`FK_886acc99303b9e5f7d7689c2b99\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`favorite_item\` ADD CONSTRAINT \`FK_a3ca503bf4cd5f09ce4907603e4\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`verification_code\` ADD CONSTRAINT \`FK_9d714363703b95d7bb9a9be0248\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shipping_address\` ADD CONSTRAINT \`FK_2aa99b101de6fb5f3089bd4b7a9\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_a9e568150eecef07380e7f5fc7c\` FOREIGN KEY (\`shippingAddressId\`) REFERENCES \`shipping_address\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_caabe91507b3379c7ba73637b84\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cart_item\` ADD CONSTRAINT \`FK_75db0de134fe0f9fe9e4591b7bf\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cart_item\` ADD CONSTRAINT \`FK_158f0325ccf7f68a5b395fa2f6a\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cart_item\` ADD CONSTRAINT \`FK_26a8ff17b49cc3b5dcbdd7d357a\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`cart_item\` DROP FOREIGN KEY \`FK_26a8ff17b49cc3b5dcbdd7d357a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cart_item\` DROP FOREIGN KEY \`FK_158f0325ccf7f68a5b395fa2f6a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`cart_item\` DROP FOREIGN KEY \`FK_75db0de134fe0f9fe9e4591b7bf\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_caabe91507b3379c7ba73637b84\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_a9e568150eecef07380e7f5fc7c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`shipping_address\` DROP FOREIGN KEY \`FK_2aa99b101de6fb5f3089bd4b7a9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`verification_code\` DROP FOREIGN KEY \`FK_9d714363703b95d7bb9a9be0248\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`favorite_item\` DROP FOREIGN KEY \`FK_a3ca503bf4cd5f09ce4907603e4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`favorite_item\` DROP FOREIGN KEY \`FK_886acc99303b9e5f7d7689c2b99\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_ff0c0301a95e517153df97f6812\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_6147ce2b2b2ee9280d460e3a145\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_9e5435ba76dbc1f1a0705d4db43\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_30444bc52b4ea6e3c539950dcdf\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`file\` DROP FOREIGN KEY \`FK_261e767bcc16d38cf69b4f2a0fb\``,
    );
    await queryRunner.query(`DROP TABLE \`cart_item\``);
    await queryRunner.query(`DROP TABLE \`order\``);
    await queryRunner.query(`DROP TABLE \`shipping_address\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`verification_code\``);
    await queryRunner.query(`DROP TABLE \`favorite_item\``);
    await queryRunner.query(
      `DROP INDEX \`REL_6147ce2b2b2ee9280d460e3a14\` ON \`product\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_29a733971f71626611bb3808eb\` ON \`product\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_22cc43e9a74d7498546e9a63e7\` ON \`product\``,
    );
    await queryRunner.query(`DROP TABLE \`product\``);
    await queryRunner.query(
      `DROP INDEX \`REL_30444bc52b4ea6e3c539950dcd\` ON \`category\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_23c05c292c439d77b0de816b50\` ON \`category\``,
    );
    await queryRunner.query(`DROP TABLE \`category\``);
    await queryRunner.query(`DROP TABLE \`visual_resource\``);
    await queryRunner.query(`DROP TABLE \`file\``);
  }
}
