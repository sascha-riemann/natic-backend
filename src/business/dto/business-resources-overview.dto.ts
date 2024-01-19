import { ResourceCategoryDTO } from '../../resources/dto/resource-category.dto';
import { ResourceDTO } from '../../resources/dto/resource.dto';

export interface ResourcesDTO {
  category: ResourceCategoryDTO;
  resources: ResourceDTO[];
}
