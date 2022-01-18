import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CharacterTable1642424873231 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'characters',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'resume',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'man_character',
            type: 'tinyint',
            default: 0,
          },
        ],
      }),
    );

    await queryRunner.addColumn(
      'characters',
      new TableColumn({
        name: 'actor_id',
        type: 'int',
      }),
    );

    await queryRunner.createForeignKey(
      'characters',
      new TableForeignKey({
        columnNames: ['actor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'actors',
      }),
    );

    await queryRunner.addColumn(
      'characters',
      new TableColumn({
        name: 'movie_id',
        type: 'int',
      }),
    );

    await queryRunner.createForeignKey(
      'characters',
      new TableForeignKey({
        columnNames: ['movie_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'movies',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('characters');
    const actorForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('actor_id') !== -1,
    );
    await queryRunner.dropForeignKey('characters', actorForeignKey);
    await queryRunner.dropColumn('characters', 'actor_id');

    const movieForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('movie_id') !== -1,
    );
    await queryRunner.dropForeignKey('characters', movieForeignKey);
    await queryRunner.dropColumn('characters', 'movie_id');

    await queryRunner.dropTable('characters');
  }
}
