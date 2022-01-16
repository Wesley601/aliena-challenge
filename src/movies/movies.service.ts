import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  findAll() {
    return this.movieRepository.find();
  }
}
