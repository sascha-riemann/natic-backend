import { ResourcesDTO } from '../../business/dto/business-resources-overview.dto';

export type PlanningDto = {
  id: number;
  date: Date;
  project: {
    id: number;
    name: string;
  };
  users: {
    id: number;
    firstName: string;
    lastName: string;
  }[];
  resources: ResourcesDTO[];
};
