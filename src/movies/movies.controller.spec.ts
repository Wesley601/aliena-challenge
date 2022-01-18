import { Test, TestingModule } from '@nestjs/testing';
import { Movie } from './entities/movie.entity';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

describe('MoviesController', () => {
  let movieController: MoviesController;

  const movies = [
    new Movie({
      id: 1,
      title: 'Brilho eterno de uma mente sem lembranças',
      releaseDate: '2004-07-23',
    }),
    new Movie({ id: 2, title: 'bee movie', releaseDate: '2007-12-07' }),
    new Movie({ id: 3, title: 'O Farol', releaseDate: '2020-01-02' }),
  ];

  const mockMovieService = {
    create: jest.fn((dto) => ({ id: Date.now(), ...dto })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    findOne: jest.fn((id) => movies.find((movie) => movie.id == id)),
    findAll: jest.fn((name) =>
      name ? movies.filter((movie) => movie.title.includes(name)) : movies,
    ),
    remove: jest.fn((id) => {
      const movie = movies.find((movie) => movie.id == id);
      if (movie) {
        delete movie.id;

        return movie;
      }

      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [MoviesService],
    })
      .overrideProvider(MoviesService)
      .useValue(mockMovieService)
      .compile();

    movieController = module.get<MoviesController>(MoviesController);
  });

  it('should be defined', () => {
    expect(movieController).toBeDefined();
  });

  describe('create', () => {
    it('should create a movie', async () => {
      const body = {
        title: 'any_title',
        releaseDate: '2021-01-01',
        resume: 'resume',
      };

      const result = await movieController.create(body);

      expect(result).toEqual({
        id: expect.any(Number),
        ...body,
      });
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      const id = '1';

      const body = {
        title: 'any_title',
        releaseDate: '2021-01-01',
        resume: 'resume',
      };

      const result = await movieController.update(id, body);

      expect(result).toEqual({
        id: expect.any(Number),
        ...body,
      });
    });
  });

  describe('findOne', () => {
    it('should find a movie by id', async () => {
      const id = '1';

      const result = await movieController.findOne(id);

      expect(result).toEqual(movies[0]);
    });
  });

  describe('findAll', () => {
    it('should find all movies', async () => {
      const result = await movieController.findAll('');

      expect(result).toEqual(movies);
    });

    it('should search by movie title', async () => {
      const result = await movieController.findAll('Farol');

      expect(result).toEqual([movies[2]]);
    });
  });

  describe('delete', () => {
    it('should delete a movie', async () => {
      const result = await movieController.remove('2');
      const { title, releaseDate, resume } = movies[1];
      expect(result).toEqual({
        title,
        releaseDate,
        resume,
      });
    });
  });
});
