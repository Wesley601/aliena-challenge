import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const newMovie = this.movieRepository.create(createMovieDto);

    return this.movieRepository.save(newMovie);
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const movieToUpdate = await this.movieRepository.findOneOrFail(id);
    Object.assign(movieToUpdate, updateMovieDto);

    return this.movieRepository.save(movieToUpdate);
  }

  findOne(id: number) {
    return this.movieRepository.findOneOrFail(id);
  }

  findAll(movie?: string) {
    const options: FindManyOptions<Movie> = {};

    if (movie) {
      options.where = `title like '%${movie}%'`;
    }

    return this.movieRepository.find(options);
  }

  async remove(id: number) {
    const movieToDelete = await this.movieRepository.findOneOrFail(id);
    return this.movieRepository.remove(movieToDelete);
  }
}
