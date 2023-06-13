import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/service/users.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { SignUp } from '../dto/sign-up';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../users/entity/user.entity';
import { Repository } from 'typeorm';
import { SignIn } from '../dto/sign-in';
import { jwtConstants } from '../constants/jwtCostants';

@Injectable()
export class AuthenticationService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(signIn: SignIn): Promise<{ token: string }> {
    const user = await this.usersService.findByUsername(signIn.username);
    const payload = { username: signIn.username, sub: user.id };
    const secret = jwtConstants.secret;
    return {
      token: this.jwtService.sign(payload, { secret }),
    };
  }

  async create(userCreate: SignUp): Promise<{ token: string }> {
    let user = await this.usersService.findByUsername(userCreate.username);
    if (user) {
      throw new ConflictException('username');
    }
    user = await this.usersService.findByEmail(userCreate.email);
    if (user) {
      throw new ConflictException('email');
    }
    userCreate.password = await bcrypt.hash(userCreate.password, 10);
    return await this.usersRepository.insert(userCreate).then(() =>
      this.login({
        username: userCreate.username,
        password: userCreate.password,
      }),
    );
  }
}
