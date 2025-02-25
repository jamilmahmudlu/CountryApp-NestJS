import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsPositive, IsString, Length } from 'class-validator';

export class AddCalendarEventsDto {
  @Type()
  @IsString()
  @Length(2, 2)
  @ApiProperty({ default: 'US' })
  countryCode: string;

  @Type()
  @IsNumber()
  @IsPositive()
  @ApiProperty({ default: 2025 })
  year: number;

  @Type()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ default: ['Valentines Day'], isArray: true, type: String })
  holidays: string[];
}
