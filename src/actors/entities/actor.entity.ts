import { Character } from 'src/characters/entities/character.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('actors')
export class Actor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('datetime', { name: 'birth_date' })
  birthDate: string;

  @OneToMany(() => Character, (character) => character.actor)
  characters: Character[];
}
