import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guard/auth.guard';
import { Roles } from 'src/auth/role/roles.decorator';
import { RolesGuard } from 'src/auth/role/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllUsers() {
    const users = await this.usersService.findAll();
    return users.map((u) => ({
      id: u._id,
      email: u.email,
      role: u.role,
    }));
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req) {
    return req.user;
  }

  @Get('email/:email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getByEmail(@Param('email') email: string) {
    const user = await this.usersService.findByEmail(email);
    return {
      id: user._id,
      email: user.email,
      role: user.role,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    return {
      id: user._id,
      email: user.email,
      role: user.role,
    };
  }
}