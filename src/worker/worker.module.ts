import { Module, OnModuleInit } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { CountryApi } from 'src/api/country.api';
import { CountryModule } from 'src/country/country.module';
import { PopulationApi } from 'src/api/population.api';
import { FlagApi } from 'src/api/flag.api';

@Module({
  imports: [CountryModule],
  controllers: [],
  providers: [WorkerService, CountryApi, PopulationApi, FlagApi],
})
export class WorkerModule implements OnModuleInit {
  constructor(private readonly workerService: WorkerService) {}

  async onModuleInit() {
    await this.workerService.syncCountries();
    await this.workerService.syncPopulation();
    await this.workerService.syncFlags();
  }
}
