import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Country } from './Country.entity';

@Entity('populations')
export class Population extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  countryCode: string;

  @Column()
  countryId: number;

  @Column()
  year: number;

  @Column()
  value: number;

  @ManyToOne(() => Country, country => country.population, {
    onDelete: 'CASCADE',
  })
  country: Country;
}
