import { InvitationStatus } from '@shared/enums/invitation-status.enum';

export interface RepositoryInvitationModel {
  id: number;
  repositoryId: number;
  repositoryName?: string;
  senderUserId: number;
  senderName?: string;
  senderLastName?: string;
  invitedUserId: number;
  repositoryRoleId: number;
  repositoryFunctionId: number;
  roleName?: string;
  invitationStatus: InvitationStatus;
  welcomeMessage: string | null;
  createdAt: string;
}
