import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundExceptionFilter } from '../src/Filters/not-fond.filter';
import { CharactersModule } from '../src/characters/characters.module';
import { Character } from '../src/characters/entities/character.entity';
import { EntityNotFoundError } from 'typeorm';
import { Movie } from '../src/movies/entities/movie.entity';
import { Actor } from '../src/actors/entities/actor.entity';

describe('ActorsController (e2e)', () => {
  let app: INestApplication;

  const movies = [
    new Character({
      id: 1,
      name: 'any name 1',
      manCharacter: true,
      resume: null,
      movieId: Date.now(),
      actorId: Date.now(),
    }),
    new Character({
      id: 2,
      name: 'any name 2',
      manCharacter: false,
      resume: null,
      movieId: Date.now(),
      actorId: Date.now(),
    }),
    new Character({
      id: 3,
      name: 'any name 3',
      manCharacter: true,
      resume: 'resume',
      movieId: Date.now(),
      actorId: Date.now(),
    }),
  ];

  const mockCharacterRepository = {
    save: jest.fn((dto) => dto),
    create: jest.fn((dto) => ({ id: Date.now(), ...dto })),
    findOneOrFail: jest.fn((id) =>
      Promise.resolve(movies.find((movie) => movie.id == id)),
    ),
  };

  const mockActorRepository = {
    findOneOrFail: jest.fn((id) =>
      Promise.resolve({
        id,
        name: 'any actor',
        birthDate: '2018-05-23',
      }),
    ),
  };

  const mockMovieRepository = {
    findOneOrFail: jest.fn((id) =>
      Promise.resolve({
        id,
        title: 'any movie',
        releaseDate: '2018-05-23',
        resume: 'any resume',
      }),
    ),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CharactersModule],
    })
      .overrideProvider(getRepositoryToken(Character))
      .useValue(mockCharacterRepository)
      .overrideProvider(getRepositoryToken(Actor))
      .useValue(mockActorRepository)
      .overrideProvider(getRepositoryToken(Movie))
      .useValue(mockMovieRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalFilters(new NotFoundExceptionFilter());
    await app.init();
  });

  describe('/characters (POST)', () => {
    it('should return 201 if has a correct payload', () => {
      return request(app.getHttpServer())
        .post('/characters')
        .send({
          name: 'any name',
          resume: 'any resume',
          manCharacter: true,
          actorId: Date.now(),
          movieId: Date.now(),
        })
        .expect(201);
    });

    it('should create new actor if has a correct payload', async () => {
      const actorId = Date.now();
      const movieId = Date.now();
      const body = {
        name: 'any name',
        resume: 'any resume',
        manCharacter: true,
        actorId,
        movieId,
      };

      const response = await request(app.getHttpServer())
        .post('/characters')
        .send(body);

      return expect(response.body).toEqual({
        id: expect.any(Number),
        name: 'any name',
        resume: 'any resume',
        manCharacter: true,
        actor: {
          id: actorId,
          name: 'any actor',
          birthDate: '2018-05-23',
        },
        movie: {
          id: movieId,
          title: 'any movie',
          releaseDate: '2018-05-23',
          resume: 'any resume',
        },
      });
    });

    it('should create new character without the resume', async () => {
      const actorId = Date.now();
      const movieId = Date.now();
      const body = {
        name: 'any name',
        manCharacter: true,
        actorId: actorId,
        movieId: movieId,
      };

      const response = await request(app.getHttpServer())
        .post('/characters')
        .send(body);

      return expect(response.body).toEqual({
        id: expect.any(Number),
        name: 'any name',
        manCharacter: true,
        actor: {
          id: actorId,
          name: 'any actor',
          birthDate: '2018-05-23',
        },
        movie: {
          id: movieId,
          title: 'any movie',
          releaseDate: '2018-05-23',
          resume: 'any resume',
        },
      });
    });

    it('should return 400 if do not pass the actor name', () => {
      const body = {
        manCharacter: true,
        actorId: Date.now(),
        movieId: Date.now(),
      };

      return request(app.getHttpServer())
        .post('/characters')
        .send(body)
        .expect(400);
    });

    it('should return 404 if the actor was not found', () => {
      const body = {
        name: 'any name',
        manCharacter: true,
        actorId: Date.now(),
        movieId: Date.now(),
      };

      jest
        .spyOn(mockActorRepository, 'findOneOrFail')
        .mockRejectedValueOnce(
          new EntityNotFoundError({ type: new Actor(), name: 'Actor' }, null),
        );

      return request(app.getHttpServer())
        .post('/characters')
        .send(body)
        .expect(404);
    });

    it('should return error message if the actor was not found', async () => {
      const actorId = Date.now();

      const body = {
        name: 'any name',
        manCharacter: true,
        actorId: actorId,
        movieId: Date.now(),
      };

      jest
        .spyOn(mockActorRepository, 'findOneOrFail')
        .mockRejectedValueOnce(
          new EntityNotFoundError(
            { type: new Actor(), name: 'Actor' },
            actorId,
          ),
        );

      const response = await request(app.getHttpServer())
        .post('/characters')
        .send(body);

      return expect(response.body).toEqual({
        message: `Could not find any entity of type "Actor" matching: ${actorId}`,
      });
    });

    it('should return 404 if the movie was not found', () => {
      const body = {
        name: 'any name',
        manCharacter: true,
        actorId: Date.now(),
        movieId: Date.now(),
      };

      jest
        .spyOn(mockMovieRepository, 'findOneOrFail')
        .mockRejectedValueOnce(
          new EntityNotFoundError({ type: new Movie(), name: 'Movie' }, null),
        );

      return request(app.getHttpServer())
        .post('/characters')
        .send(body)
        .expect(404);
    });

    it('should return error message if the movie was not found', async () => {
      const movieId = Date.now();

      const body = {
        name: 'any name',
        manCharacter: true,
        actorId: Date.now(),
        movieId: movieId,
      };

      jest
        .spyOn(mockMovieRepository, 'findOneOrFail')
        .mockRejectedValueOnce(
          new EntityNotFoundError(
            { type: new Movie(), name: 'Movie' },
            movieId,
          ),
        );

      const response = await request(app.getHttpServer())
        .post('/characters')
        .send(body);

      return expect(response.body).toEqual({
        message: `Could not find any entity of type "Movie" matching: ${movieId}`,
      });
    });
  });
});
