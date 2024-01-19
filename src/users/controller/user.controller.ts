import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserDto } from '../dto/user.dto';
import { UsersService } from '../service/users.service';
import { BusinessId } from '../../business/decorator/business.decorator';
import { JwtAuthGuard } from '../../authentication/guard/JwtAuthGuard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getUsers(@BusinessId() businessId: number): Promise<UserDto[]> {
    return await this.userService.getUsers(businessId);
  }

  @Get(':userId')
  async getUser(
    @Param('userId') userId: number,
    @BusinessId() businessId: number,
  ): Promise<UserDto> {
    const user = await this.userService.getUser(userId, businessId);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      workTimePerDay: user.businessUserConfigs?.at(0)?.workTimePerDay,
    } as UserDto;
  }

  @Post()
  createUser(
    @BusinessId() businessId: number,
    @Body() dto: CreateUserDto,
  ): Promise<void> {
    return this.userService.createUser(dto, businessId);
  }

  @Post(':userId')
  @UseGuards(JwtAuthGuard)
  updateUser(
    @BusinessId() businessId: number,
    @Body() dto: UpdateUserDto,
  ): Promise<void> {
    return this.userService.updateUser(businessId, dto);
  }

  @Delete('business/:userId')
  @UseGuards(JwtAuthGuard)
  removeFromBusiness(
    @BusinessId() businessId: number,
    @Param('userId') userId: number,
  ): Promise<void> {
    return this.userService.deleteBusinessUser(businessId, userId);
  }
}
