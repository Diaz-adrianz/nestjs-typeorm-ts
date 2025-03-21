import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNotifTokenUnique1742553029763 implements MigrationInterface {
    name = 'UpdateNotifTokenUnique1742553029763'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification"."notification_tokens" ADD CONSTRAINT "UQ_7d7f78f6fdad22356849e43f44c" UNIQUE ("user_id", "device_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification"."notification_tokens" DROP CONSTRAINT "UQ_7d7f78f6fdad22356849e43f44c"`);
    }

}
