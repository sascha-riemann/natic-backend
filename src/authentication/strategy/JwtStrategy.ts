import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants/jwtCostants';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      secretOrKey: jwtConstants.secret,
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
      ]),
      ignoreExpiration: false,
    });
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies.jwt) {
      return req.cookies.jwt;
    }
    return null;
  }

  async validate(payload: any) {
    const userId = payload?.sub;
    if (!userId) return;
    const user = await this.userRepository.findOne({
      relations: [
        'businessUserConfigs',
        'businessUserConfigs.business',
        'businessUserConfigs.role',
        'businessUserConfigs.role.businessPermissions',
        'businessUserConfigs.role.projectPermissions',
      ],
      where: {
        id: userId,
      },
    });
    return user;
  }
}
