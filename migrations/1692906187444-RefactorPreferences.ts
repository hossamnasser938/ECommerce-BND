import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorPreferences1692906187444 implements MigrationInterface {
    name = 'RefactorPreferences1692906187444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`preference\` DROP FOREIGN KEY \`FK_0990a6dd2425968d479f4bb91e6\``);
        await queryRunner.query(`DROP INDEX \`REL_0990a6dd2425968d479f4bb91e\` ON \`preference\``);
        await queryRunner.query(`ALTER TABLE \`preference\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`preferenceId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_d4207055ad1a09811cbbb27b28\` (\`preferenceId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_d4207055ad1a09811cbbb27b28\` ON \`user\` (\`preferenceId\`)`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_d4207055ad1a09811cbbb27b287\` FOREIGN KEY (\`preferenceId\`) REFERENCES \`preference\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_d4207055ad1a09811cbbb27b287\``);
        await queryRunner.query(`DROP INDEX \`REL_d4207055ad1a09811cbbb27b28\` ON \`user\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_d4207055ad1a09811cbbb27b28\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`preferenceId\``);
        await queryRunner.query(`ALTER TABLE \`preference\` ADD \`userId\` int NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_0990a6dd2425968d479f4bb91e\` ON \`preference\` (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`preference\` ADD CONSTRAINT \`FK_0990a6dd2425968d479f4bb91e6\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
