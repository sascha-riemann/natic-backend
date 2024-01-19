import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from '../entity/business.entity';
import { BusinessCreateDto } from '../dto/business-create.dto';
import { BusinessSelectDto } from '../dto/business-select.dto';
import { ResourceCategoryDTO } from '../../resources/dto/resource-category.dto';
import { ResourcesDTO } from '../dto/business-resources-overview.dto';
import { BusinessUserConfig } from '../entity/business-user-config.entity';
import { User } from '../../users/entity/user.entity';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<Business> {
    return this.businessRepository.findOne({
      where: { id },
      relations: [
        'businessUserConfigs',
        'businessUserConfigs.user',
        'resourceCategories',
        'resourceCategories.resources',
      ],
    });
  }

  async getUserBusinesses(userId: number): Promise<BusinessSelectDto[]> {
    const businesses = await this.businessRepository.findBy({
      businessUserConfigs: {
        user: {
          id: userId,
        },
      },
    });
    return businesses.map((o) => ({
      id: o.id,
      name: o.name,
      description: o.description,
      address: o.address,
    }));
  }

  async createBusiness(
    userId: number,
    dto: BusinessCreateDto,
  ): Promise<Business> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    const business = new Business();
    business.name = dto.name;
    business.address = dto.address;
    business.description = dto.description;

    const businessUserConfig = new BusinessUserConfig();
    businessUserConfig.user = user;

    business.businessUserConfigs = [businessUserConfig];

    // TODO: Check if already exists
    return this.businessRepository.save(business);
  }

  async getBusinessResourceCategories(
    businessId: number,
  ): Promise<ResourceCategoryDTO[]> {
    const business = await this.findById(businessId);
    return business?.resourceCategories?.map((resource) => ({
      id: resource.id,
      name: resource.name,
    }));
  }

  async getBusinessResources(businessId: number): Promise<ResourcesDTO[]> {
    const business = await this.findById(businessId);

    return business?.resourceCategories?.map((category) => ({
      category,
      resources: category.resources?.map((resource) => ({
        id: resource.id,
        name: resource.name,
        identification: resource.identification,
        category: {
          id: category.id,
          name: category.name,
        },
      })),
    }));
  }
}
