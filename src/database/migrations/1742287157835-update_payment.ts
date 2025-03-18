import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePayment1742287157835 implements MigrationInterface {
    name = 'UpdatePayment1742287157835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction"."payments" ADD "transfer_proof" character varying`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" ADD "expired_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TYPE "transaction"."payments_status_enum" RENAME TO "payments_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "transaction"."payments_status_enum" AS ENUM('pending', 'paid', 'succeeded', 'failed', 'expired')`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" ALTER COLUMN "status" TYPE "transaction"."payments_status_enum" USING "status"::"text"::"transaction"."payments_status_enum"`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "transaction"."payments_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "transaction"."payments_method_enum" RENAME TO "payments_method_enum_old"`);
        await queryRunner.query(`CREATE TYPE "transaction"."payments_method_enum" AS ENUM('ewallet', 'manual_transfer', 'virtual_account', 'over_the_counter')`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" ALTER COLUMN "method" TYPE "transaction"."payments_method_enum" USING "method"::"text"::"transaction"."payments_method_enum"`);
        await queryRunner.query(`DROP TYPE "transaction"."payments_method_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "transaction"."payments_method_enum_old" AS ENUM('ewallet', 'virtual_account', 'over_the_counter')`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" ALTER COLUMN "method" TYPE "transaction"."payments_method_enum_old" USING "method"::"text"::"transaction"."payments_method_enum_old"`);
        await queryRunner.query(`DROP TYPE "transaction"."payments_method_enum"`);
        await queryRunner.query(`ALTER TYPE "transaction"."payments_method_enum_old" RENAME TO "payments_method_enum"`);
        await queryRunner.query(`CREATE TYPE "transaction"."payments_status_enum_old" AS ENUM('pending', 'succeeded', 'failed', 'expired')`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" ALTER COLUMN "status" TYPE "transaction"."payments_status_enum_old" USING "status"::"text"::"transaction"."payments_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "transaction"."payments_status_enum"`);
        await queryRunner.query(`ALTER TYPE "transaction"."payments_status_enum_old" RENAME TO "payments_status_enum"`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" DROP COLUMN "expired_at"`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" DROP COLUMN "transfer_proof"`);
    }

}
