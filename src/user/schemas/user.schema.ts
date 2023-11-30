import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {
  @Prop()
  _id: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  locked: number;
}

export const UserSchema = SchemaFactory.createForClass(User);