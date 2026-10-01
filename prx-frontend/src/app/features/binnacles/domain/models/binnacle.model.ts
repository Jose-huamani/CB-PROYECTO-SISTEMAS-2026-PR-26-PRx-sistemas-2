export interface BinnacleTaskModel {
  id: string;
  title: string;
  completed: boolean;
}

export interface BinnacleLinkModel {
  id: string;
  url: string;
}

export interface BinnacleModel {
  id: number;
  userId: number;
  name: string;
  content: string;
  tasks: BinnacleTaskModel[];
  links: BinnacleLinkModel[];
  createdAt: string;
  updatedAt: string;
}
