import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1706010755792 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS "user" (' +
        'id TEXT PRIMARY KEY, ' +
        'email TEXT NOT NULL UNIQUE, ' +
        'username TEXT NOT NULL UNIQUE, ' +
        'password TEXT NOT NULL' +
        ');',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "user`);
  }
}
