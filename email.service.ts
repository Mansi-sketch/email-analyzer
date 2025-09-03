import { Injectable } from '@nestjs/common';
import * as Imap from 'imap-simple';
import { simpleParser } from 'mailparser';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Email, EmailDocument } from './email.schema';
import { detectESPFromHeaders } from './esp.util';

@Injectable()
export class EmailService {
  constructor(@InjectModel(Email.name) private emailModel: Model<EmailDocument>) {}

  /**
   * Try IMAP -> fetch unseen recent message, parse headers -> store
   * Returns saved doc or null (if IMAP fails or no message)
   */
  async fetchLatestEmail(): Promise<EmailDocument | null> {
    const config = {
      imap: {
        user: process.env.IMAP_USER,
        password: process.env.IMAP_PASS,
        host: process.env.IMAP_HOST || 'imap.gmail.com',
        port: Number(process.env.IMAP_PORT || 993),
        tls: true,
        authTimeout: 5000,
      },
    } as any;

    try {
      const connection = await Imap.connect(config);
      await connection.openBox('INBOX');

      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const searchCriteria: any[] = ['UNSEEN', ['SINCE', yesterday.toUTCString()]];
      const fetchOptions = { bodies: ['HEADER', 'TEXT'], struct: true } as any;
      const results = await connection.search(searchCriteria, fetchOptions);

      if (!results || !results.length) {
        await connection.end();
        return null;
      }

      const first = results[0];
      const headerPart = first.parts.find((p: any) => p.which === 'HEADER');
      const textPart = first.parts.find((p: any) => p.which === 'TEXT');

      const headerString = headerPart
        ? Object.entries(headerPart.body)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
            .join('\n')
        : '';

      const parsed = await simpleParser(textPart?.body || '');

      const receivedChain = (headerString.match(/\n?Received:.*?(?=\n[A-Z][a-zA-Z-]*:|$)/gs) || []).map((s: string) =>
        s.replace(/\s+/g, ' ').trim()
      );

      const esp = detectESPFromHeaders(headerString);

      const email = new this.emailModel({
        subject: parsed.subject || 'Unknown Subject',
        from: parsed.from?.text || 'Unknown',
        esp,
        receivingChain,
        rawHeaders: headerString,
      });

      await email.save();
      await connection.end();
      return email;
    } catch (e) {
      // console.warn('IMAP fetch failed', e);
      return null;
    }
  }
}
