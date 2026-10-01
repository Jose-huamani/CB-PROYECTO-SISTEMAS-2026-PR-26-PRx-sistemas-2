export interface CreateNoteRequest {
  title: string;
  content: string;
  links: {
    id: string;
    url: string;
  }[];
}
