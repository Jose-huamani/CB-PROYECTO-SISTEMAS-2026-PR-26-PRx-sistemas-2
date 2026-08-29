import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { CountryPrismaMapper } from '@modules/profiles/infrastructure/mappers/country-prisma.mapper';
import { CountryRepository } from '@modules/profiles/domain/repositories/country.repository';
import { GetCountriesQuery } from '@modules/profiles/application/queries/get-countries/get-countries.query';

@QueryHandler(GetCountriesQuery)
export class GetCountriesHandler implements IQueryHandler<GetCountriesQuery> {
  constructor(
    @Inject(CountryRepository)
    private readonly countryRepository: CountryRepository,
  ) { }

  async execute() {
    const countries = await this.countryRepository.findAll();

    return {
      data: CountryPrismaMapper.toDomainList(countries),
    };
  }
}
