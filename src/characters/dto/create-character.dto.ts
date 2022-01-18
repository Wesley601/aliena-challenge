import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCharacterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  resume?: string;

  @IsBoolean()
  @IsOptional()
  manCharacter?: boolean;

  @IsNumber()
  actorId: number;

  @IsNumber()
  movieId: number;
}
