import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Email, EmailDocument } from './email.schema';
import { EmailService } from './email.service';

@Controller('emails')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    @InjectModel(Email.name) private emailModel: Model<EmailDocument>
  ) {}

  // Try fetch via IMAP; otherwise return last saved
  @Get('latest')
  async getLatestEmail() {
    const fetched = await this.emailService.fetchLatestEmail();
    if (fetched) return fetched;
    return await this.emailModel.findOne().sort({ _id: -1 });
  }

  @Get()
  async getAllEmails() {
    return await this.emailModel.find().sort({ _id: -1 });
  }
}
