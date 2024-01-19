import { Controller, Post, Body, UseGuards, Res, Get } from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from '../service/authentication.service';
import { SignIn } from '../dto/sign-in';
import { LocalAuthGuard } from '../guard/LocalAuthGuard';
import { JwtAuthGuard } from '../guard/JwtAuthGuard';

@Controller('authentication')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @UseGuards(JwtAuthGuard)
  @Get('check')
  async checkAuthentication(): Promise<void> {
    //
  }

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Body() signIn: SignIn, @Res() res: Response): Promise<void> {
    const token = await this.authService.signIn(signIn);
    this.setAuthenticationCookie(token, res);
  }

  private setAuthenticationCookie(token: string, response: Response): void {
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);
    response
      .cookie('jwt', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires,
      })
      .send({ status: 'ok' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('sign-out')
  async signOut(@Res() res: Response): Promise<string | void> {
    res.clearCookie('jwt').send({ status: 'ok' });
  }
}
