import { ResourceCategoryDTO } from './resource-category.dto';

export interface ResourceDTO {
  id: number;
  name: string;
  identification: string;
  category: ResourceCategoryDTO;
}
