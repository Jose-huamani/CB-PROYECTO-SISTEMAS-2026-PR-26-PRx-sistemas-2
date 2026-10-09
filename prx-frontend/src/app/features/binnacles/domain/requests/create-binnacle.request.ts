export interface CreateBinnacleRequest {
  name: string;
  content: string;
  tasks: { id: string; title: string; completed: boolean }[];
  links: { id: string; url: string }[];
}
