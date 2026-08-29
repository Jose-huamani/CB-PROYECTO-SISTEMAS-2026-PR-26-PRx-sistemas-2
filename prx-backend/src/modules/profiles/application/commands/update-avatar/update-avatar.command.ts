export type AvatarUploadFile = {
  buffer: Buffer;
  mimetype: string;
  size: number;
};

export class UpdateAvatarCommand {
  constructor(
    public readonly userId: number,
    public readonly file: AvatarUploadFile,
  ) { }
}
