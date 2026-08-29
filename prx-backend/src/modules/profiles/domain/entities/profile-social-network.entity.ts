export class ProfileSocialNetworkEntity {
  constructor(
    public readonly id: number,
    public readonly profileId: number,
    public readonly socialNetworkId: number,
    public readonly username: string,
    public readonly status: number,
  ) { }
}
