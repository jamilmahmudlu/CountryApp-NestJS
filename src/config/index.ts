import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../../.env') });
export default {
  countryApiURL: process.env.COUNTRY_API_URL!,
  populationApiURL: process.env.POPULATION_API_URL!,
  flagApiURL: process.env.FLAG_API_URL!,
};
