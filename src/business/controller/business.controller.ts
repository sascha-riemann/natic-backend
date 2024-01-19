import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { BusinessService } from '../service/business.service';
import { BusinessCreateDto } from '../dto/business-create.dto';
import { JwtAuthGuard } from '../../authentication/guard/JwtAuthGuard';
import {
  AuthenticatedUser,
  AuthUser,
} from '../../authentication/decorators/user-decorator';
import { BusinessSelectDto } from '../dto/business-select.dto';
import { BusinessId } from '../decorator/business.decorator';
import { ResourcesDTO } from '../dto/business-resources-overview.dto';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getUserBusinesses(
    @AuthUser() user: AuthenticatedUser,
  ): Promise<BusinessSelectDto[]> {
    return this.businessService.getUserBusinesses(user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createBusiness(
    @AuthUser() user: AuthenticatedUser,
    @Body() dto: BusinessCreateDto,
  ): Promise<number> {
    const business = await this.businessService.createBusiness(user.id, dto);
    return business.id;
  }

  @Get('resources')
  @UseGuards(JwtAuthGuard)
  // TODO: Guard isAdmin
  getBusinessResources(
    @AuthUser() user: AuthenticatedUser,
    @BusinessId() businessId: number,
  ): Promise<ResourcesDTO[]> {
    return this.businessService.getBusinessResources(businessId);
  }
}
