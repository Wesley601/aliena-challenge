import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

describe('MoviesController', () => {
  let movieController: MoviesController;

  const mockMovieService = {
    create: jest.fn((dto) => ({ id: Date.now(), ...dto })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
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
});
