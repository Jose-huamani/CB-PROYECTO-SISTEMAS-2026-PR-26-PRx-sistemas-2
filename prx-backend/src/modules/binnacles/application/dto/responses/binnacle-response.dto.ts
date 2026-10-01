export class BinnacleResponseDto {
  id!: number;
  userId!: number;
  name!: string;
  content!: string;
  tasks!: { id: string; title: string; completed: boolean }[];
  links!: { id: string; url: string }[];
  createdAt!: Date;
  updatedAt!: Date;
}
