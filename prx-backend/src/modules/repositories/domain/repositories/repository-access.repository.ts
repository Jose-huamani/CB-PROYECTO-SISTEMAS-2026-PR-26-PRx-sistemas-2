export abstract class RepositoryAccessRepository {
  abstract canRead(repositoryId: number, userId: number): Promise<boolean>;

  abstract canUpdate(repositoryId: number, userId: number): Promise<boolean>;

  abstract canDelete(repositoryId: number, userId: number): Promise<boolean>;
}
