import {
  BinnacleLinkModel,
  BinnacleTaskModel,
} from '@features/binnacles/domain/models/binnacle.model';

export interface UpdateBinnacleRequest {
  name: string;
  content: string;
  tasks: BinnacleTaskModel[];
  links: BinnacleLinkModel[];
}
