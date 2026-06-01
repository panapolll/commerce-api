import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'กรุณาใส่อีเมลให้ถูกต้อง' })
  email!: string;
  @IsString()
  @MinLength(10, { message: 'รหัสผ่านต้องมีอย่างน้อย 10 ตัวอักษร' })
  password!: string;
}

export class LoginDto {
  @IsString({ message: 'กรุณาใส่อีเมลให้ถูกต้อง' })
  email!: string;
  @IsString()
  @MinLength(10, { message: 'รหัสผ่านต้องมีอย่างน้อย 10 ตัวอักษร' })
  password!: string;
}
