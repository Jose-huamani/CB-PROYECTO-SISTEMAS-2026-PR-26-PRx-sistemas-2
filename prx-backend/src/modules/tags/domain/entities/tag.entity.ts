import { BaseEntity } from '@shared/domain/base.entity';

export class TagEntity extends BaseEntity {
  constructor(
    id: number | null,
    public readonly name: string,
    public readonly status?: number,
  ) {
    super(id);
  }
}
