import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../authentication/guard/JwtAuthGuard';
import {
  AuthenticatedUser,
  AuthUser,
} from '../../authentication/decorators/user-decorator';
import { PlanningService } from '../service/planning.service';
import { PlanningDto } from '../dto/planning.dto';
import { BusinessId } from '../../business/decorator/business.decorator';
import { Roles } from '../../utils/roles.decorator';
import { PermissionKeys } from '../../role/dto/role.dto';
import { RoleGuard } from '../../utils/role-guard';

@Controller('planning')
export class PlanningController {
  constructor(private readonly planningService: PlanningService) {}

  @Get(':businessId/:start/:end')
  getPlanning(
    @AuthUser() user: AuthenticatedUser,
    @Param('businessId') businessId: number,
    @Param('start') start: Date,
    @Param('end') end: Date,
  ): Promise<PlanningDto[]> {
    return this.planningService.getPlannings(
      businessId,
      new Date(start),
      new Date(end),
    );
  }

  @Post(':date/:projectId')
  @UseGuards(JwtAuthGuard)
  createPlanning(
    @AuthUser() user: AuthenticatedUser,
    @Param('date') date: Date,
    @Param('projectId') projectId: number,
    @BusinessId() businessId: number,
  ): Promise<number | void> {
    return this.planningService.createPlanning(
      user.id,
      new Date(date),
      projectId,
      businessId,
    );
  }

  @Delete(':planningId')
  @UseGuards(JwtAuthGuard)
  deletePlanning(
    @AuthUser() user: AuthenticatedUser,
    @Param('planningId') planningId: number,
  ): Promise<void> {
    return this.planningService.deletePlanning(planningId);
  }

  @Post(':planningId/user/:userId')
  @UseGuards(JwtAuthGuard)
  addPlanningUser(
    @AuthUser() user: AuthenticatedUser,
    @Param('planningId') planningId: number,
    @Param('userId') userId: number,
  ): Promise<void> {
    return this.planningService.addUser(planningId, userId);
  }

  @Delete(':planningId/user/:userId')
  @UseGuards(JwtAuthGuard)
  deletePlanningUser(
    @AuthUser() user: AuthenticatedUser,
    @Param('planningId') planningId: number,
    @Param('userId') userId: number,
  ): Promise<void> {
    return this.planningService.deletePlanningUser(planningId, userId);
  }

  @Post(':planningId/resource/:resourceId')
  @UseGuards(JwtAuthGuard)
  addPlanningResource(
    @AuthUser() user: AuthenticatedUser,
    @Param('planningId') planningId: number,
    @Param('resourceId') resourceId: number,
  ): Promise<void> {
    return this.planningService.addResource(planningId, resourceId);
  }

  @Delete(':planningId/resource/:resourceId')
  @UseGuards(JwtAuthGuard)
  deletePlanningResource(
    @AuthUser() user: AuthenticatedUser,
    @Param('planningId') planningId: number,
    @Param('resourceId') resourceId: number,
  ): Promise<void> {
    return this.planningService.deletePlanningResource(planningId, resourceId);
  }
}
