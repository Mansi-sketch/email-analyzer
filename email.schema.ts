import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EmailDocument = HydratedDocument<Email>;

@Schema({ timestamps: true })
export class Email {
  @Prop() subject: string;
  @Prop() from: string;
  @Prop() esp: string;
  @Prop([String]) receivingChain: string[];
  @Prop() rawHeaders: string;
}

export const EmailSchema = SchemaFactory.createForClass(Email);
