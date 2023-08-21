import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserProfile1692645560288 implements MigrationInterface {
  name = 'AddUserProfile1692645560288';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`name\` \`profileId\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE \`profile\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`visualResourceId\` int NULL, UNIQUE INDEX \`REL_f7d7a61017b4cdc5f638e9ae00\` (\`visualResourceId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`profileId\``);
    await queryRunner.query(`ALTER TABLE \`user\` ADD \`profileId\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_9466682df91534dd95e4dbaa61\` (\`profileId\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_9466682df91534dd95e4dbaa61\` ON \`user\` (\`profileId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile\` ADD CONSTRAINT \`FK_f7d7a61017b4cdc5f638e9ae001\` FOREIGN KEY (\`visualResourceId\`) REFERENCES \`visual_resource\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_9466682df91534dd95e4dbaa616\` FOREIGN KEY (\`profileId\`) REFERENCES \`profile\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_9466682df91534dd95e4dbaa616\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`profile\` DROP FOREIGN KEY \`FK_f7d7a61017b4cdc5f638e9ae001\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_9466682df91534dd95e4dbaa61\` ON \`user\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP INDEX \`IDX_9466682df91534dd95e4dbaa61\``,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`profileId\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`profileId\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_f7d7a61017b4cdc5f638e9ae00\` ON \`profile\``,
    );
    await queryRunner.query(`DROP TABLE \`profile\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`profileId\` \`name\` varchar(255) NOT NULL`,
    );
  }
}
