import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  // post request of /auth/signUp route
  @Post('signUp')
  signUp(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }

  @Post('signIn')
  signIn() {
    return this.authService.signIn();
  }

  @Get('test')
  testing() {
    return 'ok';
  }
}
