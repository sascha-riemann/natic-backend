import { RoleService } from './role.service';
import { Test } from '@nestjs/testing';
import { RoleCreate } from '../dto/role.dto';
import { BusinessService } from '../../business/service/business.service';
import { Business } from '../../business/entity/business.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '../entity/role.entity';
import { User } from '../../users/entity/user.entity';
import { UsersService } from '../../users/service/users.service';

describe('RoleService', () => {
  let roleService: RoleService;
  let businessService: BusinessService;
  let userService: UsersService;

  let business: Business;
  let adminUser: User;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [],
      providers: [RoleService, BusinessService, UsersService],
    }).compile();

    roleService = moduleRef.get<RoleService>(RoleService);
    businessService = moduleRef.get<BusinessService>(BusinessService);
    userService = moduleRef.get<UsersService>(UsersService);

    adminUser = await userService.createUser(
      'sascha',
      'sascha',
      'Sascha',
      'Riemann',
    );
    business = await businessService.createBusiness(adminUser.id, {
      name: 'Natic',
      address: 'Berlin',
      description: 'Lorem Ipsum',
    });
  });

  it('should create a admin role', async () => {
    const dto: RoleCreate = {
      name: 'Admin',
      businessPermissions: {
        createProjects: true,
      },
      projectPermissions: {
        updateInformation: true,
      },
    };

    // roleService.createRole(dto);

    // expect(await).toBe();
  });
});
