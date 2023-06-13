import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BusinessService } from '../service/business.service';
import { BusinessCreateDto } from '../dto/business-create.dto';
import { JwtAuthGuard } from '../../authentication/guard/JwtAuthGuard';
import {
  AuthenticatedUser,
  AuthUser,
} from '../../authentication/decorators/user-decorator';
import { BusinessSelectDto } from '../dto/business-select.dto';
import { User } from '../../users/entity/user.entity';
import { BusinessCreateStaffDTO } from '../dto/business-create-staff.dto';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getOrganisations(
    @AuthUser() user: AuthenticatedUser,
  ): Promise<BusinessSelectDto[]> {
    return this.businessService.getUserBusinesses(user.userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createBusiness(
    @AuthUser() user: AuthenticatedUser,
    @Body() dto: BusinessCreateDto,
  ): Promise<number> {
    return this.businessService.createBusiness(user.userId, dto);
  }

  // @Post('user/add')
  // @UseGuards(JwtAuthGuard)
  // // TODO: Guard isAdmin
  // addUser(@Body() dto: BusinessAddUserDto): Promise<void> {
  //   return this.businessService.addUser(dto);
  // }

  @Get(':businessId/staff')
  @UseGuards(JwtAuthGuard)
  // TODO: Guard isAdmin
  getBusinessStaff(
    @AuthUser() user: AuthenticatedUser,
    @Param('businessId') businessId: number,
  ): Promise<User[]> {
    return this.businessService.getBusinessUser(businessId);
  }

  @Post(':businessId/staff')
  @UseGuards(JwtAuthGuard)
  // TODO: Guard isAdmin
  addBusinessStaff(
    @AuthUser() user: AuthenticatedUser,
    @Param('businessId') businessId: number,
    @Body() businessCreateStaffDTO: BusinessCreateStaffDTO,
  ): Promise<void> {
    return this.businessService.createBusinessStaff(
      businessCreateStaffDTO,
      businessId,
    );
  }
}
