import { Actor } from 'src/actors/entities/actor.entity';
import { Movie } from 'src/movies/entities/movie.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('characters')
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'man_character' })
  manCharacter: boolean;

  @Column('text')
  resume?: string;

  @Column({ type: 'int', name: 'movie_id' })
  movieId: number;

  @ManyToOne(() => Actor, (actor) => actor.characters)
  @JoinColumn({ name: 'actor_id' })
  actor: Actor;

  @ManyToOne(() => Movie, (movie) => movie.characters)
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;
}
