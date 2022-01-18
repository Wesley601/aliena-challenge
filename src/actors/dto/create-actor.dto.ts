import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class CreateActorDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsISO8601()
  readonly birthDate: string;
}
