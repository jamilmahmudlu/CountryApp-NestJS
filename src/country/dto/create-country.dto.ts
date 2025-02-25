import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUrl, Length, MinLength } from 'class-validator';

export class CreateCountryDto {
  @Type()
  @IsString()
  @MinLength(3)
  name: string;

  @Type()
  @IsString()
  @Length(2, 2)
  code: string;

  @Type()
  @IsString()
  @IsUrl()
  @IsOptional()
  flagImage?: string;
}
