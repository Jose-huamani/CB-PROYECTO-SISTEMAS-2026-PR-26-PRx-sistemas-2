import envConfig from '@config/env.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { MailModule } from '@shared/infrastructure/mail/mail.module';
import { PrismaModule } from '@shared/infrastructure/prisma/prisma.module';
import { StorageModule } from '@shared/infrastructure/storage/storage.module';

import { HealthModule } from '@modules/health/health.module';
import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';
import { BinnaclesModule } from '@modules/binnacles/binnacles.module';
import { RepositoriesModule } from '@modules/repositories/repositories.module';
import { ProfilesModule } from '@modules/profiles/profiles.module';
import { SocialNetworksModule } from '@modules/social-networks/social-networks.module';
import { FilesModule } from '@modules/files/files.module';
import { NotesModule } from '@modules/notes/notes.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { RepositoryInvitationsModule } from '@modules/repository-invitations/repository-invitations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),

    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.getOrThrow<number>('throttle.ttl'),
            limit: config.getOrThrow<number>('throttle.limit'),
          },
        ],
      }),
    }),

    PrismaModule,
    MailModule,
    StorageModule,

    UsersModule,
    AuthModule,
    HealthModule,
    BinnaclesModule,
    RepositoriesModule,
    ProfilesModule,
    SocialNetworksModule,
    FilesModule,
    NotesModule,
    NotificationsModule,
    RepositoryInvitationsModule,
  ],
})
export class AppModule {}
