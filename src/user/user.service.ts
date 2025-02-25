import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CalendarEvents } from 'src/entities/CalendarEvents.entity';
import { Repository } from 'typeorm';
import { AddCalendarEventsDto } from './dto/add-calendar-events.dto';
import { CountryService } from 'src/country/country.service';

@Injectable()
export class UserService {
  constructor(
    private countryService: CountryService,
    @InjectRepository(CalendarEvents)
    private calendarEventsRepo: Repository<CalendarEvents>,
  ) {}

  async addCalendarEvents(userId: number, params: AddCalendarEventsDto) {
    const country = await this.countryService.country(params.countryCode);
    if (!country) throw new NotFoundException('Country not found');

    const countryHolidays =
      (await this.countryService.countryHolidays(params.year, params.countryCode)) || [];

    const holidayNames = countryHolidays.map(holiday => holiday.name);

    const filteredHolidays = params.holidays.filter(holiday => holidayNames.includes(holiday));

    const events = filteredHolidays.map(holiday =>
      this.calendarEventsRepo.create({
        countryId: country.id,
        year: params.year,
        userId,
        holiday,
      }),
    );

    const result = await this.calendarEventsRepo.save(events);

    return result;
  }
}
