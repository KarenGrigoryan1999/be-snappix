import { Body, Controller, Get, Param, Post, Put, Query, Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { Auth } from '../auth/roles-auth.decorator';
import { ROLES } from '../roles/constants/roles.constant';

import { UsersService } from './users.service';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth(ROLES.ADMIN)
  @Get()
  getAll(@Query('page') page: string, @Query('perPage') perPage: string) {
    return this.usersService.getAllUsers(page, perPage);
  }

  @Get('email/:email')
  getByEmail(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Get('open/:id')
  getUserInfoById(@Param('id') id: string) {
    return this.usersService.getUserInfoById(id);
  }

  @Post()
  create(@Body() user: CreateUserDto) {
    return this.usersService.createUser(user);
  }

  @Auth(ROLES.ADMIN, ROLES.USER)
  @Put('open/avatar')
  @UseInterceptors(FileFieldsInterceptor([{ name: "files", maxCount: 1 }]))
  updatePhoto(
    @Req() req,
    @UploadedFiles()
    files: {
      files?: any[];
    }
  ) {
    return this.usersService.uploadAvatar(files, req.user);
  }
}
