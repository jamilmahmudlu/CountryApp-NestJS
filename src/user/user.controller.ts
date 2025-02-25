import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { AddCalendarEventsDto } from './dto/add-calendar-events.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(':userId/calendar/holidays')
  async addCalendarEvents(@Param('userId') userId: number, @Body() body: AddCalendarEventsDto) {
    return this.userService.addCalendarEvents(userId, body);
  }
}
