import { IsISO8601, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsISO8601()
  readonly releaseDate: string;

  @IsString({ always: false })
  @IsOptional()
  readonly resume?: string;
}
