import { Controller, Get, Param } from '@nestjs/common';
import { BusinessService } from '../../business/service/business.service';
import { UserOverviewDto } from '../dto/user-overview.dto';

@Controller('user')
export class UserController {
  constructor(private readonly organizationService: BusinessService) {}

  @Get(':organizationId')
  async getOrganizationUserOverview(
    @Param('organizationId') organizationId: number,
  ): Promise<UserOverviewDto[]> {
    const user = await this.organizationService.getBusinessUser(organizationId);
    return user.map((u) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      roles: u.roles
        ?.filter((role) => role.business.id === organizationId)
        ?.map((r) => ({
          id: r.id,
          name: r.name,
        })),
    }));
  }
}
