import { Controller, Get, Param } from '@nestjs/common';
import { CountryService } from './country.service';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  async list() {
    return this.countryService.list();
  }

  @Get(':code')
  async countryDetail(@Param('code') code: string) {
    return this.countryService.countryDetail(code);
  }
}
