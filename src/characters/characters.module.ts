import { Module } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CharactersController } from './characters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Character } from './entities/character.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Actor } from '../actors/entities/actor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Character, Movie, Actor])],
  controllers: [CharactersController],
  providers: [CharactersService],
})
export class CharactersModule {}
