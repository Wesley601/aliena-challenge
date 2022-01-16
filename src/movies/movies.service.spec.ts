import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  const mockMovieRepository = {
    create: jest.fn((dto) => dto),
    save: jest.fn((dto) => Promise.resolve({ id: Date.now(), ...dto })),
    findOneOrFail: jest.fn((id, dto) => Promise.resolve({ id, ...dto })),
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

    expect(await service.update(Date.now(), body)).toEqual({
      id: expect.any(Number),
      ...body,
    });
  });
});
