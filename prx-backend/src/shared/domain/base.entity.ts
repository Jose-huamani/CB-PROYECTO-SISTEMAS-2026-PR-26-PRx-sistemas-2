export abstract class BaseEntity<TId = number> {
  constructor(public readonly id: TId | null) {}
}
