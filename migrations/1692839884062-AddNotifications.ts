import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotifications1692839884062 implements MigrationInterface {
    name = 'AddNotifications1692839884062'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`notification\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`title\` varchar(255) NOT NULL, \`body\` varchar(255) NOT NULL, \`read\` tinyint NOT NULL, \`notificationTokenId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_725344aa245cb7a61c4eea55465\` FOREIGN KEY (\`notificationTokenId\`) REFERENCES \`notification_token\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_725344aa245cb7a61c4eea55465\``);
        await queryRunner.query(`DROP TABLE \`notification\``);
    }

}
