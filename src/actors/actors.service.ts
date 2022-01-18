import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateActorDto } from './dto/create-actor.dto';
import { Actor } from './entities/actor.entity';

@Injectable()
export class ActorsService {
  constructor(
    @InjectRepository(Actor)
    private actorRepository: Repository<Actor>,
  ) {}

  create(createActorDto: CreateActorDto) {
    const newActor = this.actorRepository.create(createActorDto);

    return this.actorRepository.save(newActor);
  }

  findAll() {
    return this.actorRepository.find();
  }
}
