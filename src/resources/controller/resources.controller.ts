import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ResourcesService } from '../service/resources.service';
import { ResourceCreateDto } from '../dto/resource-create.dto';
import { BusinessId } from '../../business/decorator/business.decorator';
import { ResourceUpdateDto } from '../dto/resource-update.dto';
import { ResourceCategoryCreateDto } from '../dto/resource-category-create.dto';
import { ResourceCategoryUpdateDto } from '../dto/resource-category-update.dto';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourceService: ResourcesService) {}

  @Post()
  createResource(
    @Body() dto: ResourceCreateDto,
    @BusinessId() businessId: number,
  ): Promise<number> {
    return this.resourceService.createResource(dto, businessId);
  }

  @Post('category')
  createResourceCategory(
    @Body() dto: ResourceCategoryCreateDto,
    @BusinessId() businessId: number,
  ): Promise<number> {
    return this.resourceService.createResourceCategory(dto, businessId);
  }

  @Post('category/:resourceCategoryId')
  updateResourceCategory(
    @Body() dto: ResourceCategoryUpdateDto,
  ): Promise<void> {
    return this.resourceService.updateResourceCategory(dto);
  }

  @Post(':resourceId')
  updateResource(@Body() dto: ResourceUpdateDto): Promise<number> {
    return this.resourceService.updateResource(dto);
  }

  @Delete(':resourceId')
  deleteResource(@Param('resourceId') resourceId: number): Promise<void> {
    return this.resourceService.deleteResource(resourceId);
  }

  @Delete('category/:resourceCategoryId')
  deleteResourceCategory(
    @Param('resourceCategoryId') resourceCategoryId: number,
  ): Promise<void> {
    return this.resourceService.deleteResourceCategory(resourceCategoryId);
  }
}
