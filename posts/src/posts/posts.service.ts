import { HttpService, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { firstValueFrom, toArray } from 'rxjs';

import { Post } from './entities/post.entity';
import { FileInfo } from '../files/entities/file.entity';
import { CreatePostDto } from './dto/createPost.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private readonly postRepository: typeof Post,
    @InjectModel(FileInfo) private readonly fileRepository: typeof FileInfo,
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
      formData.append('files', file.buffer, file.originalname);
    }
    const { data: fileNames } = await firstValueFrom(this.httpService.post(`http://metadata-service:3004/api/metadata`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }));

    fileNames.forEach(async (filename) => {
      const file = await this.fileRepository.create({filename});

      post.$set('files', file);
    })

    return post;
  }

  async getAllByPage(page: number, limit: number): Promise<any> {
    const posts = await this.postRepository.findAll({
      offset: (page-1)*limit,
      limit,
      include: [{
        model: FileInfo,
        attributes: {exclude: ['postId']}
      }],
    });

    return await Promise.all(posts.map(async postElement => {
      const {data: postLikesInfo} = await firstValueFrom(this.httpService.get(`http://likes-service:3005/api/likes/count/${postElement.id}`));
      const {data: userInfo} = await firstValueFrom(this.httpService.get(`http://users-service:3001/api/users/${postElement.userId}`));

      return {...postElement.toJSON(), likes: postLikesInfo.likes, username: userInfo.login};
    }));
  }
}
