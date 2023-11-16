import { HttpService, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';

import { ValidationExecption } from '../exceptions/validation.exception';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {}

  async login(userDto: LoginUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDto) {
    try {
      const {data: user} = await firstValueFrom(this.httpService.post(`http://users-service:3001/api/users`, userDto));
      return this.generateToken(user);
    } catch(e) {
      throw new ValidationExecption(e.response.data.message);
    }
  }

  async generateToken(user) {
    const payload = {
      email: user.email,
      id: user.id,
      roles: user.roles,
    };
    return {
      roles: user.roles,
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: LoginUserDto) {
    const {data: user} = await firstValueFrom(this.httpService.get(`http://users-service:3001/api/users/email/${userDto.email}`));
    if (user != null) {
      console.log(userDto.password, user);
      const arePasswordsEquals = await bcrypt.compare(
        userDto.password,
        user.password,
      );
      if (arePasswordsEquals) {
        return user;
      }
    }
    throw new UnauthorizedException({ message: 'Не верный email или пароль' });
  }
}
