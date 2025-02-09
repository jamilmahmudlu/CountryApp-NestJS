import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from 'src/entities/Country.entity';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';
import { CountryApi } from 'src/api/country.api';
import { Population } from 'src/entities/Population.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Country, Population])],
  controllers: [CountryController],
  providers: [CountryService, CountryApi],
  exports: [CountryService],
})
export class CountryModule {}
