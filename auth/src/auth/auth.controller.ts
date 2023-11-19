import { Controller, Get, Post, Body, Req } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Auth } from './roles-auth.decorator';
import { ROLES } from 'src/roles/constants/roles.constant';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('open/login')
  login(@Body() userDto: LoginUserDto) {
    return this.authService.login(userDto);
  }

  @Post('open/registration')
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
  }

  @Auth(ROLES.ADMIN, ROLES.USER)
  @Get('open/whoami')
  getProfile(@Req() req) {
    return req.user;
  }
}
