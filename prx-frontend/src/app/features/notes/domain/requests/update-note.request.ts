import { NoteLinkModel, NoteTaskModel } from '@features/notes/domain/models/note.model';

export interface UpdateNoteRequest {
  title: string;
  content: string;
  tasks: NoteTaskModel[];
  links: NoteLinkModel[];
  retainedFileIds: number[];
}
