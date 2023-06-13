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

@Controller('planning')
export class PlanningController {
  constructor(private readonly planningService: PlanningService) {}

  @Get(':businessId/:start/:end')
  @UseGuards(JwtAuthGuard)
  getPlanning(
    @AuthUser() user: AuthenticatedUser,
    @Param('businessId') businessId: number,
    @Param('start') start: Date,
    @Param('end') end: Date,
  ) {
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
  ): Promise<number | void> {
    return this.planningService.createPlanning(
      user.userId,
      new Date(date),
      projectId,
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
}
