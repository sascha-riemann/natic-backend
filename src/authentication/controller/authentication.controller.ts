import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthenticationService } from '../service/authentication.service';
import { SignUp } from '../dto/sign-up';
import { SignIn } from '../dto/sign-in';
import { LocalAuthGuard } from '../guard/LocalAuthGuard';

@Controller('authentication')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Body() signIn: SignIn): Promise<{ token: string } | null> {
    return this.authService.login(signIn);
  }

  @Post('sign-up')
  async signUp(@Body() signUp: SignUp): Promise<{ token: string } | void> {
    return this.authService.create(signUp);
  }
}
