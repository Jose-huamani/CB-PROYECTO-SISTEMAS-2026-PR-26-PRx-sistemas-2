import { CreateFolderRequest } from '@features/files/domain/requests/create-folder.request';

export type UpdateFolderRequest = Partial<Pick<CreateFolderRequest, 'name' | 'color'>>;
