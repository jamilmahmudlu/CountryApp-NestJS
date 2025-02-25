import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Population } from './Population.entity';

@Entity('countries')
export class Country extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ nullable: true })
  flagImage: string;

  @ManyToMany(() => Country, country => country.borders)
  @JoinTable({
    name: 'country_borders',
    joinColumn: { name: 'country_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'border_country_id',
      referencedColumnName: 'id',
    },
  })
  borders: Country[];

  @OneToMany(() => Population, population => population.country)
  population: Population[];
}
