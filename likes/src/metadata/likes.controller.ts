import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';

import { LikesService } from './likes.service';
import { SetLikeDto } from './dto/setLike.dto';
import { Auth } from '../auth/roles-auth.decorator';
import { ROLES } from '../roles/roles.constant';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Auth(ROLES.USER, ROLES.ADMIN)
  @Post()
  create(@Body() likeDto: SetLikeDto, @Request() req) {
    return this.likesService.setLike(likeDto, req.user.id);
  }

  @Get('count/:postId')
  getLikeCountByPostId(@Param('postId') postId: number) {
    return this.likesService.getLikeCountByPostId(postId);
  }

  @Get(':postId')
  getPostLikes(@Param('postId') postId: number) {
    return this.likesService.getPostLikesWithUserInfo(postId);
  }
}
