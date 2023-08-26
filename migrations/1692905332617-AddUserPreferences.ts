import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserPreferences1692905332617 implements MigrationInterface {
  name = 'AddUserPreferences1692905332617';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_9466682df91534dd95e4dbaa61\` ON \`user\``,
    );
    await queryRunner.query(
      `CREATE TABLE \`preference\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`getNotifications\` tinyint NOT NULL, \`userId\` int NULL, UNIQUE INDEX \`REL_0990a6dd2425968d479f4bb91e\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`preference\` ADD CONSTRAINT \`FK_0990a6dd2425968d479f4bb91e6\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`preference\` DROP FOREIGN KEY \`FK_0990a6dd2425968d479f4bb91e6\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_0990a6dd2425968d479f4bb91e\` ON \`preference\``,
    );
    await queryRunner.query(`DROP TABLE \`preference\``);
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_9466682df91534dd95e4dbaa61\` ON \`user\` (\`profileId\`)`,
    );
  }
}
