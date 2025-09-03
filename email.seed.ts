import { connect, model } from 'mongoose';
import { EmailSchema } from './email.schema';
import * as dotenv from 'dotenv';

dotenv.config();

async function seed() {
  await connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/emailAnalyzer');
  const EmailModel = model('Email', EmailSchema);

  const exists = await EmailModel.findOne({ subject: 'Test Email - Seed Data' }).exec();
  if (exists) {
    console.log('Seed already exists');
    process.exit(0);
  }

  const mockEmail = new EmailModel({
    subject: 'Test Email - Seed Data',
    from: 'seed@example.com',
    esp: 'Gmail',
    receivingChain: ['mx1.gmail.com', 'smtp-relay.gmail.com', 'inbound.mailserver.com'],
    rawHeaders:
      'Received: from mx1.gmail.com by smtp-relay.gmail.com; Received: from smtp-relay.gmail.com by inbound.mailserver.com;',
  });

  await mockEmail.save();
  console.log('✅ Seed data inserted');
  process.exit(0);
}

seed();
