import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { WorkerModule } from './worker/worker.module';
import { CountryModule } from './country/country.module';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(__dirname, '..', 'db.sqlite'),
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
      extra: {
        foreign_keys: true, // Ensure foreign key constraints are enforced
      },
    }),
    HttpModule.register({ global: true }),
    CountryModule,
    UserModule,
    WorkerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
