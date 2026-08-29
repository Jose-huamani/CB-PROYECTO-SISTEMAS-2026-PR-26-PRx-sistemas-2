export class GetRepositoryByIdQuery {
  constructor(
    public readonly id: number,
    public readonly userId: number,
  ) {}
}
