import { Injectable } from '@nestjs/common';
import { CountryApi } from 'src/api/country.api';
import { FlagApi } from 'src/api/flag.api';
import { PopulationApi } from 'src/api/population.api';
import { CountryService } from 'src/country/country.service';
import { Country } from 'src/entities/Country.entity';

@Injectable()
export class WorkerService {
  constructor(
    private readonly countryApi: CountryApi,
    private readonly populationApi: PopulationApi,
    private readonly flagApi: FlagApi,
    private readonly countryService: CountryService,
  ) {}
  async syncCountries() {
    const dbCountries = await this.countryService.list();
    const apiCountries = await this.countryApi.get('/AvailableCountries');

    const promises: Promise<Country>[] = [];
    for (const country of apiCountries) {
      const checkExists = dbCountries.some(dbCountry => dbCountry.name === country.name);
      if (!checkExists) {
        promises.push(
          this.countryService.create({
            name: country.name,
            code: country.countryCode,
          }),
        );
      }
    }

    await Promise.all(promises);
  }

  async syncPopulation() {
    const countries = await this.countryService.listWithPopulation();
    const promises: Promise<any>[] = [];
    const result = await this.populationApi
      .get(`/countries/population`)
      .then(response => response.data)
      .catch(() => false);
    for (const country of countries) {
      if (country.population.length) continue;

      const population = result.find(item => item.code.slice(0, -1) === country.code);
      if (!population) continue;
      promises.push(
        this.countryService.createPopulation(
          population.populationCounts.map(item => ({
            countryCode: country.code,
            value: item.value,
            year: item.year,
            countryId: country.id,
          })),
        ),
      );
    }
    await Promise.all(promises);
  }

  async syncFlags() {
    const countries = await this.countryService.list();
    const flags = await this.flagApi
      .get(`/countries/flag/images`)
      .then(response => response.data)
      .catch(() => false);

    const promises: Promise<any>[] = [];

    for (const country of countries) {
      const flag = flags.find(item => item.iso2 === country.code);
      if (flag) {
        promises.push(this.countryService.update(country.id, { flagImage: flag.flag }));
      }
    }
    await Promise.all(promises);
  }
}
