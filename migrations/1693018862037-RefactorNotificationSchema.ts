import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorNotificationSchema1693018862037
  implements MigrationInterface
{
  name = 'RefactorNotificationSchema1693018862037';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_725344aa245cb7a61c4eea55465\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_d4207055ad1a09811cbbb27b28\` ON \`user\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` CHANGE \`notificationTokenId\` \`userId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_1ced25315eb974b73391fb1c81b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_1ced25315eb974b73391fb1c81b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` CHANGE \`userId\` \`notificationTokenId\` int NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_d4207055ad1a09811cbbb27b28\` ON \`user\` (\`preferenceId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_725344aa245cb7a61c4eea55465\` FOREIGN KEY (\`notificationTokenId\`) REFERENCES \`notification_token\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
