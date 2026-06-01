import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtservice: JwtService,
  ) {}

  async register(email: string, password: string) {
    const existing = await this.usersService
      .findByEmail(email)
      .catch(() => null);
    if (existing) throw new ConflictException('Email already exists');
    const user = await this.usersService.createUser(email, password);
    return { id: user._id, email: user.email };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Email นี้ไม่มีอยู่ในระบบ');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email หรือ Password ไม่ถูกต้อง');
    }

    const payload = { sub: user._id, email: user.email, role: user.role };
    return { access_token: this.jwtservice.sign(payload) };
  }
}