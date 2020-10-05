import {MigrationInterface, QueryRunner} from "typeorm";

export class TopicNull1600656628059 implements MigrationInterface {
    name = 'TopicNull1600656628059'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `usersRoom` CHANGE `name` `name` int UNSIGNED NULL", undefined);
        await queryRunner.query("ALTER TABLE `room` CHANGE `topic` `topic` varchar(255) NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `room` CHANGE `topic` `topic` varchar(255) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `usersRoom` CHANGE `name` `name` int UNSIGNED NOT NULL", undefined);
    }

}
