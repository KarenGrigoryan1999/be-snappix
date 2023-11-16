import { IsString, Length } from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: 'Введите уникальный идентификатор роли' })
  @Length(3, 20, {
    message: 'Идентификатор не может быть короче 3 и длиннее 20 символов',
  })
  readonly value: string;

  @IsString({ message: 'Введите название роли' })
  @Length(3, 20, {
    message: 'Описание не может быть короче 3 и длиннее 20 символов',
  })
  readonly description: string;
}
