import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1705941557765 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS "comment" (' +
        'id TEXT PRIMARY KEY,' +
        'comment TEXT,' +
        'user_id TEXT NOT NULL' +
        ');',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "comment";`);
  }
}
