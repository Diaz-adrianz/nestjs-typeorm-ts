import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNotif1742527510263 implements MigrationInterface {
    name = 'CreateNotif1742527510263'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification"."notification_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "token" character varying NOT NULL, "device_id" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "user_id" uuid, CONSTRAINT "PK_2f7d7b15525f17c7123e6422d28" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "notification"."notifications_type_enum" AS ENUM('general', 'payment')`);
        await queryRunner.query(`CREATE TABLE "notification"."notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "type" "notification"."notifications_type_enum" NOT NULL DEFAULT 'general', "title" character varying NOT NULL, "body" text, "metadata" json, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification"."user_notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_read" boolean NOT NULL DEFAULT false, "user_id" uuid, "notification_id" uuid, CONSTRAINT "PK_569622b0fd6e6ab3661de985a2b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notification"."notification_tokens" ADD CONSTRAINT "FK_046760648e82c2ae7c5253d1a14" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification"."user_notifications" ADD CONSTRAINT "FK_ae9b1d1f1fe780ef8e3e7d0c0f6" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification"."user_notifications" ADD CONSTRAINT "FK_944431ae979397c8b56a99bf024" FOREIGN KEY ("notification_id") REFERENCES "notification"."notifications"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification"."user_notifications" DROP CONSTRAINT "FK_944431ae979397c8b56a99bf024"`);
        await queryRunner.query(`ALTER TABLE "notification"."user_notifications" DROP CONSTRAINT "FK_ae9b1d1f1fe780ef8e3e7d0c0f6"`);
        await queryRunner.query(`ALTER TABLE "notification"."notification_tokens" DROP CONSTRAINT "FK_046760648e82c2ae7c5253d1a14"`);
        await queryRunner.query(`DROP TABLE "notification"."user_notifications"`);
        await queryRunner.query(`DROP TABLE "notification"."notifications"`);
        await queryRunner.query(`DROP TYPE "notification"."notifications_type_enum"`);
        await queryRunner.query(`DROP TABLE "notification"."notification_tokens"`);
    }

}
