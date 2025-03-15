import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1741500330605 implements MigrationInterface {
  name = 'Init1741500330605';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "auth"."permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "feature" character varying NOT NULL, "action" character varying NOT NULL, "description" character varying, CONSTRAINT "UQ_ea7dea22d9e18c52f2feb2bc1a4" UNIQUE ("feature", "action"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "auth"."roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "description" character varying, "is_active" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "auth"."user_roles" ("id" SERIAL NOT NULL, "is_active" boolean NOT NULL DEFAULT false, "user_id" uuid, "role_id" uuid, CONSTRAINT "UQ_23ed6f04fe43066df08379fd034" UNIQUE ("user_id", "role_id"), CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "auth"."users_provider_enum" AS ENUM('email', 'google')`
    );
    await queryRunner.query(
      `CREATE TABLE "auth"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying NOT NULL, "username" character varying(50) NOT NULL, "phone" character varying, "password" character varying, "provider" "auth"."users_provider_enum" NOT NULL, "avatar" character varying, "is_active" boolean NOT NULL DEFAULT false, "is_verified" boolean NOT NULL DEFAULT false, "verify_sent_at" TIMESTAMP, "last_signed_in_at" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "auth"."roles_permissions_permissions" ("roles_id" uuid NOT NULL, "permissions_id" uuid NOT NULL, CONSTRAINT "PK_58cb0486653ecb1cfec7b2d9733" PRIMARY KEY ("roles_id", "permissions_id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b8dedd64100fd607eaae3907ab" ON "auth"."roles_permissions_permissions" ("roles_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_35f451c91e5274df9bf05479ab" ON "auth"."roles_permissions_permissions" ("permissions_id") `
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "auth"."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."roles_permissions_permissions" ADD CONSTRAINT "FK_b8dedd64100fd607eaae3907ab8" FOREIGN KEY ("roles_id") REFERENCES "auth"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."roles_permissions_permissions" ADD CONSTRAINT "FK_35f451c91e5274df9bf05479ab2" FOREIGN KEY ("permissions_id") REFERENCES "auth"."permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth"."roles_permissions_permissions" DROP CONSTRAINT "FK_35f451c91e5274df9bf05479ab2"`
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."roles_permissions_permissions" DROP CONSTRAINT "FK_b8dedd64100fd607eaae3907ab8"`
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`
    );
    await queryRunner.query(
      `ALTER TABLE "auth"."user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`
    );
    await queryRunner.query(
      `DROP INDEX "auth"."IDX_35f451c91e5274df9bf05479ab"`
    );
    await queryRunner.query(
      `DROP INDEX "auth"."IDX_b8dedd64100fd607eaae3907ab"`
    );
    await queryRunner.query(
      `DROP TABLE "auth"."roles_permissions_permissions"`
    );
    await queryRunner.query(`DROP TABLE "auth"."users"`);
    await queryRunner.query(`DROP TYPE "auth"."users_provider_enum"`);
    await queryRunner.query(`DROP TABLE "auth"."user_roles"`);
    await queryRunner.query(`DROP TABLE "auth"."roles"`);
    await queryRunner.query(`DROP TABLE "auth"."permissions"`);
  }
}
