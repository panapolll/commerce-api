import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(email: string, password: string, role: string = 'user') {
    const existingEmail = await this.userModel.findOne({ email }).exec();
    if (existingEmail) throw new ConflictException('Email นี้ถูกใช้แล้ว');

    const hash = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      email,
      password: hash,
      role,
    });

    return newUser.save();
  }

  async findByEmail(email: string) {
    if (typeof email !== 'string') {
      throw new BadRequestException();
    }
    const findMail = await this.userModel
      .findOne({ email })
      .select('+password')
      .exec();
    if (!findMail) throw new NotFoundException();
    return findMail;
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('ไม่พบ user นี้');
    return user;
  }

  async findAll() {
    return this.userModel.find().select('-password').exec();
  }

  async getString() {
    return 'จ้าาาา';
  }

  testApi(b: string) {
    b = 'อะโห';
    return b;
  }
}