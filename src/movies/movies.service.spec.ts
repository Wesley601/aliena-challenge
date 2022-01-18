import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  const movies = [
    new Movie({
      id: 1,
      title: 'Brilho eterno de uma mente sem lembranças',
      releaseDate: '2004-07-23',
    }),
    new Movie({ id: 2, title: 'bee movie', releaseDate: '2007-12-07' }),
    new Movie({ id: 3, title: 'O Farol', releaseDate: '2020-01-02' }),
  ];

  const mockMovieRepository = {
    create: jest.fn((dto) => dto),
    save: jest.fn((dto) => Promise.resolve({ id: Date.now(), ...dto })),
    findOneOrFail: jest.fn((id) =>
      Promise.resolve(movies.find((movie) => movie.id == id)),
    ),
    find: jest.fn((options) => {
      if (Object.keys(options).length !== 0) {
        const search: string = options.where;
        const result = search.substring(
          search.indexOf('%') + 1,
          search.lastIndexOf('%'),
        );

        return Promise.resolve(
          movies.filter((movie) => movie.title.includes(result)),
        );
      }

      return Promise.resolve(movies);
    }),
    remove: jest.fn((dto) => {
      const { title, releaseDate, resume } = dto;
      return { title, releaseDate, resume };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMovieRepository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new movie record', async () => {
    const body = {
      title: 'any_title',
      releaseDate: '2021-01-01',
      resume: 'resume',
    };

    expect(await service.create(body)).toEqual({
      id: expect.any(Number),
      ...body,
    });
  });

  it('should update a movie record', async () => {
    const body = {
      title: 'any_title',
      releaseDate: '2021-01-01',
      resume: 'resume',
    };

    expect(await service.update(1, body)).toEqual({
      id: expect.any(Number),
      ...body,
    });
  });

  it('should find a movie record', async () => {
    expect(await service.findOne(1)).toEqual(movies[0]);
  });

  it('should find all movies records', async () => {
    expect(await service.findAll('')).toEqual(movies);
  });

  it('should search by movie title', async () => {
    expect(await service.findAll('Farol')).toEqual([movies[2]]);
  });

  it('should remove movie record by id', async () => {
    const { title, releaseDate, resume } = movies[2];
    expect(await service.remove(3)).toEqual({ title, releaseDate, resume });
  });
});
