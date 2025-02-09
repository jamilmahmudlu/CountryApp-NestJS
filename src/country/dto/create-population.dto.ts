import { Type } from 'class-transformer';
import { IsNumber, IsString, Length } from 'class-validator';

export class CreatePopulationDto {
  @Type()
  @IsString()
  @Length(2, 2)
  countryCode: string;

  @Type()
  @IsNumber()
  countryId: number;

  @Type()
  @IsNumber()
  year: number;

  @Type()
  @IsNumber()
  value: number;
}
