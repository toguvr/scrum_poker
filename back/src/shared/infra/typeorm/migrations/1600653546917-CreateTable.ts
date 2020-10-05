import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTable1600653546917 implements MigrationInterface {
    name = 'CreateTable1600653546917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `users` (`id` varchar(36) NOT NULL, `name` varchar(255) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `usersRoom` (`id` varchar(36) NOT NULL, `name` int UNSIGNED NOT NULL, `user_id` varchar(255) NOT NULL, `room_id` varchar(255) NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX `roomuser_room_id_fk` (`room_id`), INDEX `roomuser_user_id_fk` (`user_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `room` (`id` varchar(36) NOT NULL, `topic` varchar(255) NOT NULL, `adm_id` varchar(255) NOT NULL, `isPrivate` tinyint UNSIGNED NOT NULL DEFAULT '0', `password` varchar(255) NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX `users_room_user_id_fk` (`adm_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `usersRoom` ADD CONSTRAINT `FK_16c8d947f96115a0d9e4cf9b0d0` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE", undefined);
        await queryRunner.query("ALTER TABLE `usersRoom` ADD CONSTRAINT `FK_1724600701bb30d3dda542936bb` FOREIGN KEY (`room_id`) REFERENCES `room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE", undefined);
        await queryRunner.query("ALTER TABLE `room` ADD CONSTRAINT `FK_84350ac6d1c0fd7c3a377760d2d` FOREIGN KEY (`adm_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `room` DROP FOREIGN KEY `FK_84350ac6d1c0fd7c3a377760d2d`", undefined);
        await queryRunner.query("ALTER TABLE `usersRoom` DROP FOREIGN KEY `FK_1724600701bb30d3dda542936bb`", undefined);
        await queryRunner.query("ALTER TABLE `usersRoom` DROP FOREIGN KEY `FK_16c8d947f96115a0d9e4cf9b0d0`", undefined);
        await queryRunner.query("DROP INDEX `users_room_user_id_fk` ON `room`", undefined);
        await queryRunner.query("DROP TABLE `room`", undefined);
        await queryRunner.query("DROP INDEX `roomuser_user_id_fk` ON `usersRoom`", undefined);
        await queryRunner.query("DROP INDEX `roomuser_room_id_fk` ON `usersRoom`", undefined);
        await queryRunner.query("DROP TABLE `usersRoom`", undefined);
        await queryRunner.query("DROP TABLE `users`", undefined);
    }

}
