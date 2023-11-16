import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Введите корректный email' })
  readonly email: string;

  @Length(2, 20, { message: 'Логин должно быть от 2 до 20 символов' })
  readonly login: string;

  @Length(8, 20, { message: 'Пароль может содержать от 8 до 40 символов' })
  readonly password: string;
}
