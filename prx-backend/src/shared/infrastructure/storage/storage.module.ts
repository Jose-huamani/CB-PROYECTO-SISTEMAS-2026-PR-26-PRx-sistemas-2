import { Global, Module } from '@nestjs/common';
import { TigrisStorageService } from '@shared/infrastructure/storage/tigris-storage.service';

@Global()
@Module({
  providers: [TigrisStorageService],
  exports: [TigrisStorageService],
})
export class StorageModule {}
