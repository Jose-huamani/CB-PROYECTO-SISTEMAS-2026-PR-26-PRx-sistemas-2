export class TownEntity {
  constructor(
    public readonly id: number | null,
    public readonly name: string,
    public readonly status: number,
  ) { }
}
