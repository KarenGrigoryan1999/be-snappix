import { IsNotEmpty } from 'class-validator';

export class SetLikeDto {
  @IsNotEmpty()
  readonly postId: number;
}
