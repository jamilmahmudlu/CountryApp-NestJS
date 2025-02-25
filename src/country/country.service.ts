import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/entities/Country.entity';
import { In, Repository } from 'typeorm';
import { CreateCountryDto } from './dto/create-country.dto';
import { CountryApi } from 'src/api/country.api';
import { Population } from 'src/entities/Population.entity';
import { CreatePopulationDto } from './dto/create-population.dto';

@Injectable()
export class CountryService {
  constructor(
    private countryApi: CountryApi,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(Population)
    private readonly populationRepository: Repository<Population>,
  ) {}
  list() {
    return this.countryRepository.find({
      select: { id: true, name: true, code: true },
    });
  }

  listWithPopulation() {
    return this.countryRepository.find({ relations: ['population'] });
  }

  create(params: CreateCountryDto) {
    return this.countryRepository.save(this.countryRepository.create(params));
  }

  update(id: number, params: Partial<CreateCountryDto>) {
    return this.countryRepository.update(id, params);
  }

  async country(code: string) {
    const country = await this.countryRepository.findOne({
      where: { code },
      select: { id: true, name: true, code: true },
    });

    if (!country) {
      throw new NotFoundException('Country not found');
    }

    return country;
  }

  async countryDetail(code: string) {
    const country = await this.countryRepository.findOne({
      where: { code },

      select: {
        id: true,
        name: true,
        code: true,
        flagImage: true,
        borders: {
          id: true,
          name: true,
          code: true,
        },
        population: {
          id: true,
          year: true,
          value: true,
        },
      },
      relations: ['borders', 'population'],
    });

    if (!country) {
      throw new NotFoundException('Country not found');
    }

    if (!country.borders.length) {
      const detailedData = await this.countryApi.get(`/CountryInfo/${code}`).catch(() => false);
      if (detailedData) {
        const borderCountries = await this.countryRepository.find({
          where: {
            code: In(detailedData.borders.map(country => country.countryCode)),
          },
        });
        country.borders = borderCountries;
        await this.countryRepository.save(country);
      }
    }

    return country;
  }

  async countryPopulation(code: string) {
    const population = await this.populationRepository.find({
      where: { countryCode: code },
    });

    if (!population) {
      throw new NotFoundException('Population not found');
    }

    return population;
  }

  async createPopulation(list: CreatePopulationDto[]) {
    return this.populationRepository.save(list);
  }

  async countryHolidays(year: number, code: string) {
    return this.countryApi.get(`/PublicHolidays/${year}/${code}`).catch(() => false);
  }
}
