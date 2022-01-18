import { Character } from '../../characters/entities/character.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movies')
export class Movie {
  constructor(todo?: Partial<Movie>) {
    this.id = todo?.id;
    this.title = todo?.title;
    this.resume = todo?.resume;
    this.releaseDate = todo?.releaseDate;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  resume?: string;

  @Column('datetime', { name: 'release_date' })
  releaseDate: string;

  @OneToMany(() => Character, (character) => character.movie)
  characters: Character[];
}
