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
    let dbCountries = await this.countryService.list();
    let apiCountries = await this.countryApi.get('/AvailableCountries');

    let promises: Promise<Country>[] = [];
    for (const country of apiCountries) {
      let checkExists = dbCountries.some(
        (dbCountry) => dbCountry.name === country.name,
      );
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
    let countries = await this.countryService.listWithPopulation();
    let promises: Promise<any>[] = [];
    let result = await this.populationApi
      .get(`/countries/population`)
      .then((response) => response.data)
      .catch(() => false);
    for (const country of countries) {
      if (country.population.length) continue;

      let population = result.find(
        (item) => item.code.slice(0, -1) === country.code,
      );
      if (!population) continue;
      promises.push(
        this.countryService.createPopulation(
          population.populationCounts.map((item) => ({
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
    let countries = await this.countryService.list();
    let flags = await this.flagApi
      .get(`/countries/flag/images`)
      .then((response) => response.data)
      .catch(() => false);

    let promises: Promise<any>[] = [];

    for (const country of countries) {
      let flag = flags.find((item) => item.iso2 === country.code);
      if (flag) {
        promises.push(
          this.countryService.update(country.id, { flagImage: flag.flag }),
        );
      }
    }
    await Promise.all(promises);
  }
}
