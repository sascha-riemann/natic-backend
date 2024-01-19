import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from '../ressources/resource';
import { Repository } from 'typeorm';
import { ResourceCreateDto } from '../dto/resource-create.dto';
import { ResourceCategory } from '../ressources/resource.category';
import { BusinessService } from '../../business/service/business.service';
import { ResourceUpdateDto } from '../dto/resource-update.dto';
import { ResourceCategoryCreateDto } from '../dto/resource-category-create.dto';
import { ResourceCategoryUpdateDto } from '../dto/resource-category-update.dto';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    @InjectRepository(ResourceCategory)
    private readonly resourceCategoryRepository: Repository<ResourceCategory>,
    private readonly businessService: BusinessService,
  ) {}

  async findById(id: number): Promise<Resource> {
    return this.resourceRepository.findOneBy({
      id,
    });
  }

  async createResource(
    dto: ResourceCreateDto,
    businessId: number,
  ): Promise<number> {
    const category = await this.resourceCategoryRepository.findOneBy({
      id: dto.categoryId,
    });
    const business = await this.businessService.findById(businessId);
    const resource = await this.resourceRepository.save({
      resourceCategory: category,
      identification: dto.identification,
      name: dto.name,
      business,
    });

    return resource.id;
  }

  async updateResource(dto: ResourceUpdateDto): Promise<number> {
    const category = await this.resourceCategoryRepository.findOneBy({
      id: dto.categoryId,
    });
    const resource = await this.resourceRepository.findOneBy({
      id: dto.id,
    });

    resource.name = dto.name;
    resource.identification = dto.identification;
    resource.resourceCategory = category;

    void this.resourceRepository.save(resource);

    return resource.id;
  }

  async createResourceCategory(
    dto: ResourceCategoryCreateDto,
    businessId: number,
  ): Promise<number> {
    const business = await this.businessService.findById(businessId);
    const resourceCategory = {
      business,
      name: dto.name,
    } as ResourceCategory;

    return this.resourceCategoryRepository
      .save(resourceCategory)
      .then((result) => result.id);
  }

  async updateResourceCategory(dto: ResourceCategoryUpdateDto): Promise<void> {
    const resourceCategory = await this.resourceCategoryRepository.findOneBy({
      id: dto.id,
    });

    resourceCategory.name = dto.name;

    void this.resourceCategoryRepository.save(resourceCategory);
  }

  async deleteResource(resourceId: number): Promise<void> {
    void this.resourceRepository.delete({ id: resourceId });
  }

  async deleteResourceCategory(resourceCategoryId: number): Promise<void> {
    void this.resourceCategoryRepository.delete({ id: resourceCategoryId });
  }
}
