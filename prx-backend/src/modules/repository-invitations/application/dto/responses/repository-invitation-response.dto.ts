export class RepositoryInvitationResponseDto {
  id!: number;
  repositoryId!: number;
  repositoryName?: string;
  senderUserId!: number;
  senderName?: string;
  senderLastName?: string;
  invitedUserId!: number;
  repositoryRoleId!: number;
  repositoryFunctionId!: number;
  roleName?: string;
  invitationStatus!: string;
  welcomeMessage!: string | null;
  createdAt!: Date;
}
