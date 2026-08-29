export interface CreateRepositoryInvitationRequest {
  invitedUserEmail: string;
  repositoryFunctionId: number;
  welcomeMessage?: string;
}
