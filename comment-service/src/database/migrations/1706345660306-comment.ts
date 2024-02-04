import { MigrationInterface, QueryRunner } from 'typeorm';

export class Comment1706345660306 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS "comment" (' +
        'id TEXT PRIMARY KEY,' +
        'comment TEXT,' +
        'user_id TEXT NOT NULL REFERENCES "user" (id) ON DELETE NO ACTION' +
        ');',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "comment";`);
  }
}
