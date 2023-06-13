import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../../users/service/users.service';
import { BusinessEntity } from '../entity/business.entity';
import { BusinessCreateDto } from '../dto/business-create.dto';
import { BusinessSelectDto } from '../dto/business-select.dto';
import { User } from '../../users/entity/user.entity';
import { BusinessCreateStaffDTO } from '../dto/business-create-staff.dto';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(BusinessEntity)
    private readonly businessRepository: Repository<BusinessEntity>,
    private readonly userService: UsersService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // async addUser(dto: BusinessAddUserDto): Promise<void> {
  //   const user = await this.userService.findByEmail(dto.userEmail);
  //   const organization = await this.findById(dto.organizationId);
  //   if (!organization.user) {
  //     organization.user = [];
  //   }
  //   organization.user.push(user);
  //   void this.businessRepository.save(user);
  // }

  async findById(id: number): Promise<BusinessEntity> {
    return this.businessRepository.findOne({
      where: {
        id,
      },
      relations: ['roles', 'user'],
    });
  }

  async getUserBusinesses(userId: number): Promise<BusinessSelectDto[]> {
    const user = await this.userService.findById(userId);
    const businesses = await this.businessRepository.findBy({
      user,
    });
    return businesses.map((o) => ({
      id: o.id,
      name: o.name,
      description: o.description,
      address: o.address,
    }));
  }

  async getBusinessUser(businessUser: number): Promise<User[]> {
    const organization = await this.businessRepository.findOne({
      where: {
        id: businessUser,
      },
      relations: ['user'],
    });
    return organization.user;
  }

  async createBusinessStaff(
    staffDTO: BusinessCreateStaffDTO,
    businessId: number,
  ): Promise<void> {
    let user = await this.userService.findByUsername(staffDTO.username);
    if (user) {
      throw new ConflictException('username');
    }
    user = await this.userService.findByEmail(staffDTO.email);
    if (user) {
      throw new ConflictException('email');
    }

    const business = await this.findById(businessId);

    user = new User();
    user.username = staffDTO.username;
    user.firstName = staffDTO.firstName;
    user.lastName = staffDTO.lastName;
    user.address = staffDTO.address;
    user.email = staffDTO.email;
    user.phone = staffDTO.phone;
    user = await this.userRepository.save(user);

    business.user.push(user);
    await this.businessRepository.save(business);
  }

  async createBusiness(
    userId: number,
    dto: BusinessCreateDto,
  ): Promise<number> {
    // TODO: Add default roles to organisation
    // TODO: Add admin role to user that created org
    const user = await this.userService.findById(userId);

    // TODO: Check if already exists
    return this.businessRepository
      .save({
        name: dto.name,
        address: dto.address,
        description: dto.description,
        user: [user],
      })
      .then((r) => r.id);
  }
}
