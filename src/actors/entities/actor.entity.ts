import { Character } from '../../characters/entities/character.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('actors')
export class Actor {
  constructor(actor?: Partial<Actor>) {
    this.id = actor?.id;
    this.name = actor?.name;
    this.birthDate = actor?.birthDate;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('datetime', { name: 'birth_date' })
  birthDate: string;

  @OneToMany(() => Character, (character) => character.actor)
  characters: Character[];
}
