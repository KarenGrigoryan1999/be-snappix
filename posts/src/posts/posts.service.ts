import { HttpService, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { firstValueFrom } from 'rxjs';

import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/createPost.dto';
import { EntityType } from 'src/metadata/entity-type.constant';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private readonly postRepository: typeof Post,
    private readonly httpService: HttpService,
  ) { }

  async createPost(postDto: CreatePostDto, userFiles: any) {
    const { files } = userFiles;
    const post = await this.postRepository.create({
      text: postDto.text,
      userId: postDto.userId,
    });
    const FormData = require('form-data');
    const formData = new FormData();
    for (let file of files) {
      formData.append('entityType', EntityType.POST);
      formData.append('entityId', post.id);
      formData.append('files', file.buffer, file.originalname);
    }
    await firstValueFrom(this.httpService.post(`http://metadata-service:3004/api/metadata`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }));

    return post;
  }

  async getAllByPage(page: number, limit: number): Promise<any> {
    const posts = await this.postRepository.findAll({
      offset: (page-1)*limit,
      limit,
    });

    return await Promise.all(posts.map(async postElement => {
      const {data: metadata} = await firstValueFrom(this.httpService.get(`http://metadata-service:3004/api/metadata?entityId=${postElement.id}&entityType=${EntityType.POST}`));
      const {data: postLikesInfo} = await firstValueFrom(this.httpService.get(`http://likes-service:3005/api/likes/count/${postElement.id}`));
      const {data: userInfo} = await firstValueFrom(this.httpService.get(`http://users-service:3001/api/users/${postElement.userId}`));

      return {...postElement.toJSON(), likes: postLikesInfo.likes, username: userInfo.login, files: metadata.map(metadataElement => metadataElement.filename)};
    }));
  }
}
