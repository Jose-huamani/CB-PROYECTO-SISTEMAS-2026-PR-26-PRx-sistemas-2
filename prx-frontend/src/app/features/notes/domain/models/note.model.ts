import { NoteFileModel } from '@features/notes/domain/models/note-file.model';
import { CurrentUserModel } from '@shared/models/current-user.model';

export interface NoteTaskModel {
  id: string;
  title: string;
  completed: boolean;
}

export interface NoteLinkModel {
  id: string;
  url: string;
}

export interface NoteModel {
  id: number;
  repositoryId: number;
  title: string;
  content: string;
  tasks: NoteTaskModel[];
  links: NoteLinkModel[];
  createdAt: string;
  updatedAt: string;
  createdBy: CurrentUserModel;
  files: NoteFileModel[];
}
