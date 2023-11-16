import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Like } from './entities/like.entity';
import { SetLikeDto } from './dto/setLike.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like) private readonly likesRepository: typeof Like,
  ) {}

  async setLike(likeDto: SetLikeDto, userId: number) {
    const isLiked = await this.likesRepository.findOne({
      where: {
        postId: likeDto.postId,
        userId,
      },
    });

    if (isLiked) {
      await isLiked.destroy();
    } else {
      await this.likesRepository.create(likeDto);
    }
    return true;
  }

  async getLikeCountByPostId(postId: number) {
    return {
      postId,
      likes: (await this.getPostLikes(postId)).length,
    };
  }

  async getPostLikesWithUserInfo(postId: number) {
    return this.getPostLikes(postId);
  }

  private async getPostLikes(postId: number) {
    return await this.likesRepository.findAll({
      where: {
        postId,
      },
    });
  }
}
