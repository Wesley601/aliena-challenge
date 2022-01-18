import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './movies/entities/movie.entity';
import { MoviesModule } from './movies/movies.module';
import { ActorsModule } from './actors/actors.module';
import { CharactersModule } from './characters/characters.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({ entities: [Movie] }),
    MoviesModule,
    ActorsModule,
    CharactersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
