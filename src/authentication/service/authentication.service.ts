import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/service/users.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { SignIn } from '../dto/sign-in';
import { jwtConstants } from '../constants/jwtCostants';

@Injectable()
export class AuthenticationService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsernameOrMail(username);
    if (user && bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signIn(signIn: SignIn): Promise<string> {
    const user = await this.usersService.findByUsernameOrMail(signIn.username);
    const payload = { username: user.username, sub: user.id };
    const secret = jwtConstants.secret;
    return this.jwtService.sign(payload, { secret });
  }
}
