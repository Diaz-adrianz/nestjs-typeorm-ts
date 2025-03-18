import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePayment1742275574066 implements MigrationInterface {
    name = 'UpdatePayment1742275574066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction"."payments" DROP COLUMN "method"`);
        await queryRunner.query(`CREATE TYPE "transaction"."payments_method_enum" AS ENUM('ewallet', 'virtual_account', 'over_the_counter')`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" ADD "method" "transaction"."payments_method_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction"."payments" DROP COLUMN "method"`);
        await queryRunner.query(`DROP TYPE "transaction"."payments_method_enum"`);
        await queryRunner.query(`ALTER TABLE "transaction"."payments" ADD "method" character varying`);
    }

}
