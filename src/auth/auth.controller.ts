import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from 'src/users/dto/All-User.dto';
import { CreateProductDto } from 'src/products/DTO/product.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() data: CreateUserDto) {
    return this.authService.register(data.email, data.password);
  }
  @Post('register-admin')
  registerAdmin(@Body() data: CreateUserDto & { adminKey: string }) {
    if (data.adminKey !== process.env.ADMIN_SECRET_KEY) {
      throw new UnauthorizedException('Ibvalid admin key');
    }
    return this.authService.registerAdmin(data.email, data.password);
  }

  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data.email, data.password);
  }
}
