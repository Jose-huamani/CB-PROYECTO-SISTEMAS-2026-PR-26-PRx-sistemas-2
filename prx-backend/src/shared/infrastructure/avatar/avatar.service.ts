import { Injectable } from '@nestjs/common';

@Injectable()
export class AvatarService {
  private readonly defaultAvatars: string[] = [
    'avatar/avatar1.png',
    'avatar/avatar2.png',
    'avatar/avatar3.png',
    'avatar/avatar4.png',
  ];

  getRandomAvatar(): string {
    const index = Math.floor(Math.random() * this.defaultAvatars.length);
    return this.defaultAvatars[index];
  }

  isDefaultAvatar(path: string): boolean {
    return this.defaultAvatars.includes(path);
  }
}
