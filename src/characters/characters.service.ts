import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Actor } from '../actors/entities/actor.entity';
import { Character } from '../characters/entities/character.entity';
import { Movie } from '../movies/entities/movie.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateCharacterDto } from './dto/create-character.dto';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private characterRepository: Repository<Character>,
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    @InjectRepository(Actor)
    private actorRepository: Repository<Actor>,
  ) {}

  async create(createCharacterDto: CreateCharacterDto) {
    const actor = await this.actorRepository.findOneOrFail(
      createCharacterDto.actorId,
    );

    const movie = await this.movieRepository.findOneOrFail(
      createCharacterDto.movieId,
    );

    const { name, manCharacter, resume } = createCharacterDto;
    const newCharacter = await this.characterRepository.create({
      name,
      manCharacter,
      resume,
    });

    newCharacter.actor = actor;
    newCharacter.movie = movie;

    return this.characterRepository.save(newCharacter);
  }

  findAll(movieId: string) {
    const options: FindManyOptions<Character> = {};

    if (movieId) {
      options.where = {
        movieId,
      };
    }

    return this.characterRepository.find(options);
  }
}
