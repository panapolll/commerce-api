import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private walletService: WalletService,
  ) {}

  async register(email: string, password: string) {
    const existing = await this.usersService
      .findByEmail(email)
      .catch(() => null);
    if (existing) throw new ConflictException('Email already exists');
    const user = await this.usersService.createUser(email, password);
    await this.walletService.createWallet(user._id.toString());
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
    return { access_token: this.jwtService.sign(payload) };
  }
}
