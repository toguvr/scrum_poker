import {MigrationInterface, QueryRunner} from "typeorm";

export class voteName1600659711270 implements MigrationInterface {
    name = 'voteName1600659711270'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `usersRoom` CHANGE `name` `vote` int UNSIGNED NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `usersRoom` CHANGE `vote` `name` int UNSIGNED NULL", undefined);
    }

}
