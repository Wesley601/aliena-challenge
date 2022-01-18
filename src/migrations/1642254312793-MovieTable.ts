import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class MovieTable1642254312793 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'movies',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'resume',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'release_date',
            type: 'datetime',
            isNullable: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE movies');
  }
}
