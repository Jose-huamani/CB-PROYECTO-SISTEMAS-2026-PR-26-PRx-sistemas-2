import { NoteFileModel } from '@features/notes/domain/models/note-file.model';
import { CurrentUserModel } from '@shared/models/current-user.model';

export interface NoteModel {
  id: number;
  repositoryId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  createdBy: CurrentUserModel;
  files: NoteFileModel[];
}
