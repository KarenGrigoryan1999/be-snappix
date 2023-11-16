import { IsString, Length, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsString({})
  @Length(0, 140, { message: 'Текст должен быть от 0 до 140 символов' })
  readonly text: string;

  @IsNotEmpty()
  readonly userId: number;
}
