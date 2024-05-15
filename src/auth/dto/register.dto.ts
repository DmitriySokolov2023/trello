import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be longer (6 characters +)' })
  password: string;

  @IsString()
  name: string;
}
