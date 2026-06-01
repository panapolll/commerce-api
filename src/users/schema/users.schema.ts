import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';

@Schema({ timestamps: true })
export class User {
  @IsEmail({}, { message: 'กรุณาใส่อีเมลให้ถูกต้อง' })
  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop()
  role: string = 'user';
}

export const UserSchema = SchemaFactory.createForClass(User);
