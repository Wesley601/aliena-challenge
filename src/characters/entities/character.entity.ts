import { Actor } from '../../actors/entities/actor.entity';
import { Movie } from '../../movies/entities/movie.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('characters')
export class Character {
  constructor(character?: Partial<Character>) {
    this.id = character?.id;
    this.name = character?.name;
    this.manCharacter = character?.manCharacter;
    this.resume = character?.resume;
    this.movieId = character?.movieId;
    this.actorId = character?.actorId;
  }

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

  @Column({ type: 'int', name: 'actor_id' })
  actorId: number;

  @ManyToOne(() => Actor, (actor) => actor.characters)
  @JoinColumn({ name: 'actor_id' })
  actor: Actor;

  @ManyToOne(() => Movie, (movie) => movie.characters)
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;
}
