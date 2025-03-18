import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePayment1742228485945 implements MigrationInterface {
    name = 'UpdatePayment1742228485945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction"."payments" ADD "status_updated_at" TIMESTAMP NOT NULL DEFAULT NOW()`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" DROP COLUMN "currency"`);
        await queryRunner.query(`CREATE TYPE "transaction"."payments_currency_enum" AS ENUM('IDR', 'USD')`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" ADD "currency" "transaction"."payments_currency_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" DROP COLUMN "country_code"`);
        await queryRunner.query(`CREATE TYPE "transaction"."payments_country_code_enum" AS ENUM('ID', 'US')`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" ADD "country_code" "transaction"."payments_country_code_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" DROP COLUMN "method"`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" ADD "method" character varying`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" DROP COLUMN "channel"`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" ADD "channel" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction"."payments" DROP COLUMN "channel"`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" ADD "channel" boolean`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" DROP COLUMN "method"`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" ADD "method" boolean`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" DROP COLUMN "country_code"`);
        await queryRunner.query(`DROP TYPE "transaction"."payments_country_code_enum"`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" ADD "country_code" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" DROP COLUMN "currency"`);
        await queryRunner.query(`DROP TYPE "transaction"."payments_currency_enum"`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" ADD "currency" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" DROP COLUMN "status_updated_at"`);
    }

}
