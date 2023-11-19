import { Controller, Post, Get, Query, Body, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseInterceptors(FileFieldsInterceptor([{ name: "files", maxCount: 10 }]))
  @Post('open')
  create(@Body() postDto: CreatePostDto,
  @UploadedFiles()
  files: {
    files?: any[];
  }) {
    return this.postsService.createPost(postDto, files);
  }

  @Get('open')
  getAllByPage(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.postsService.getAllByPage(page, limit);
  }
}
