import { IsNotEmpty, IsString, IsEmail, MinLength, IsEnum } from 'class-validator';

export enum Role {
  Client = 'client',
  Admin = 'Admin',
}

export class CreateAuthDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEnum(Role, { message: 'Role must be either "Admin" or "Client"' })
  @IsNotEmpty()
  role: Role;
}