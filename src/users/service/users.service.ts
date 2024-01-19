import { ConflictException, Injectable } from '@nestjs/common';

import { User } from '../entity/user.entity';
import { Equal, FindOptionsWhere, IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto, UserDto } from '../dto/user.dto';
import { hashPassword } from '../../utils/password-utils';
import { BusinessUserConfig } from '../../business/entity/business-user-config.entity';
import { Business } from '../../business/entity/business.entity';
import { tr } from 'date-fns/locale';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  findById(id: number): Promise<User | undefined> {
    if (!id) return undefined;
    return this.usersRepository.findOneBy({ id });
  }

  findByEmail(email: string): Promise<User | undefined> {
    if (!email) return undefined;
    return this.usersRepository.findOneBy({ email });
  }

  findByUsername(username: string): Promise<User | undefined> {
    if (!username) return undefined;
    return this.usersRepository.findOneBy({ username });
  }

  findByUsernameOrMail(usernameOrMail: string): Promise<User | undefined> {
    if (!usernameOrMail) return undefined;
    return this.usersRepository.findOneBy([
      { username: usernameOrMail },
      { email: usernameOrMail },
    ]);
  }

  async getUser(id: number, businessId: number): Promise<User | undefined> {
    if (!id) return undefined;

    const findOptions: FindOptionsWhere<User>[] = [{ id }];
    if (businessId) {
      findOptions.push({
        businessUserConfigs: {
          business: {
            id: businessId,
          },
        },
      });
    }

    const user = await this.usersRepository.findOne({
      relations: {
        businessUserConfigs: {
          business: true,
        },
      },
      where: findOptions,
    });

    if (!user) return undefined;

    return user;
  }

  findUserWithBusinessConfigs(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['businessUserConfigs', 'businessUserConfigs.business'],
    });
  }

  async findBusinessConfig(
    userId: number,
    businessId: number,
  ): Promise<BusinessUserConfig | undefined> {
    const user = await this.findUserWithBusinessConfigs(userId);
    return user.businessUserConfigs.find(
      (config) => config.business.id === businessId,
    );
  }

  async createUser(dto: CreateUserDto, businessId: number): Promise<void> {
    void this.verifyUser(dto.username, dto.email);
    const user = new User();
    void this.setUserProperties(
      user,
      dto.username,
      dto.email,
      dto.firstName,
      dto.lastName,
    );

    if (dto.password) {
      user.password = await hashPassword(dto.password);
    }

    if (businessId) {
      const businessUserConfig = new BusinessUserConfig();
      businessUserConfig.user = user;
      businessUserConfig.business = await this.businessRepository.findOneBy([
        {
          id: Equal(businessId),
        },
        {
          id: Not(IsNull()),
        },
      ]);
      businessUserConfig.workTimePerDay = dto.workTimePerDay;
      user.businessUserConfigs = [businessUserConfig];
    }

    await this.usersRepository.save(user);
  }

  async updateUser(businessId: number, dto: UpdateUserDto): Promise<void> {
    const user = await this.findUserWithBusinessConfigs(dto.id);

    void this.verifyUser(dto.username, dto.email, user);

    this.setUserProperties(
      user,
      dto.username,
      dto.email,
      dto.firstName,
      dto.lastName,
    );

    if (dto.password) {
      user.password = await hashPassword(dto.password);
    }

    if (businessId) {
      const config = user.businessUserConfigs.find(
        (c) => c.business.id === businessId,
      );
      config.workTimePerDay = Number(dto.workTimePerDay);
    }

    await this.usersRepository.save(user);
  }

  private setUserProperties(
    user: User,
    username: string,
    email: string,
    firstName: string,
    lastName: string,
  ): void {
    user.username = username;
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
  }

  private async verifyUser(
    username: string,
    email: string,
    currentUser?: User,
  ): Promise<void> {
    const userByUsername = await this.findByUsername(username);
    // Another user has this username
    if (userByUsername && userByUsername.id !== currentUser?.id) {
      throw new ConflictException('username');
    }

    const userByEmail = await this.findByEmail(email);
    // Another user has this email
    if (userByEmail && currentUser.id !== userByEmail.id) {
      throw new ConflictException('email');
    }
  }

  async getUsers(businessId: number): Promise<UserDto[]> {
    const users = await this.usersRepository.find({
      where: {
        businessUserConfigs: {
          business: {
            id: businessId,
          },
        },
      },
      relations: {
        businessUserConfigs: {
          role: true,
        },
      },
    });
    return users.map((user) => {
      const role = user.businessUserConfigs[0].role;
      const workTimePerDay = user.businessUserConfigs[0].workTimePerDay;
      const dto = {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        workTimePerDay,
      } as UserDto;

      if (role) {
        dto.role = {
          id: role.id,
          name: role.name,
          projectPermissions: role.projectPermissions,
          businessPermissions: role.businessPermissions,
        };
      }

      return dto;
    });
  }

  async entityToDto(user: User, buisnessId: number): Promise<UserDto> {
    const businessConfig = user.businessUserConfigs.find(
      (c) => c.business.id === buisnessId,
    );
    const role = businessConfig.role;
    const workTimePerDay = businessConfig.workTimePerDay;

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role,
      workTimePerDay,
    } as UserDto;
  }

  async deleteBusinessUser(businessId: number, userId: number): Promise<void> {
    const business = await this.findById(businessId);
    if (business.businessUserConfigs.length <= 1) {
      throw new ConflictException('minimum_one_user');
    }

    await this.usersRepository.delete(userId);
  }
}
