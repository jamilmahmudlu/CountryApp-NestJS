import { Module } from '@nestjs/common';
import { CountryModule } from 'src/country/country.module';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEvents } from 'src/entities/CalendarEvents.entity';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarEvents]), CountryModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
