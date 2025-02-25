import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Country } from './Country.entity';

@Entity('calendar_events')
export class CalendarEvents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  countryId: number;

  @ManyToOne(() => Country)
  country: Country;

  @Column()
  year: number;

  @Column()
  holiday: string;

  @CreateDateColumn()
  createdAt: Date;
}
