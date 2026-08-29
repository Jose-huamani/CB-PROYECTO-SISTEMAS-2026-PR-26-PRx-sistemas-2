import { CountryModel } from '@generated-prisma/models/Country';

export abstract class CountryRepository {
  abstract findAll(): Promise<CountryModel[]>;
}
