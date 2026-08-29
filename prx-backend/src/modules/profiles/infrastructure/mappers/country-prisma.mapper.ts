import { CountryEntity } from '@modules/profiles/domain/entities/country.entity';

type PhoneCodePrismaModel = {
  id: number;
  countryId: number;
  code: string;
  status: number;
};

type CountryPrismaModel = {
  id: number;
  name: string;
  status: number;
  phoneCodes?: PhoneCodePrismaModel[];
};

export class CountryPrismaMapper {
  static toDomain(country: CountryPrismaModel): CountryEntity {
    const phoneCode = country.phoneCodes && country.phoneCodes.length
      ? country.phoneCodes[0].code
      : null;

    return new CountryEntity(country.id, country.name, country.status, phoneCode);
  }

  static toDomainList(countries: CountryPrismaModel[]): CountryEntity[] {
    return countries.map((c) => this.toDomain(c));
  }
}
