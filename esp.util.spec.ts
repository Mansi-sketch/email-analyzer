import { detectESPFromHeaders } from '../src/email/esp.util';

describe('detectESPFromHeaders', () => {
  it('detects Gmail', () => {
    const headers = 'Received: by mail-io1-f66.google.com; X-Google-DKIM-Signature: ...';
    expect(detectESPFromHeaders(headers)).toBe('Gmail');
  });

  it('detects Microsoft 365/Outlook', () => {
    const headers = 'Received: from NAM12-BN8-obe.outlook.com (protection.outlook.com)';
    expect(detectESPFromHeaders(headers)).toBe('Microsoft 365/Outlook');
  });

  it('detects Amazon SES', () => {
    const headers = 'Received: from ses-eu-west-1.amazonses.com; X-SES-Outgoing: 2025.09.03';
    expect(detectESPFromHeaders(headers)).toBe('Amazon SES');
  });

  it('returns Unknown when no patterns match', () => {
    const headers = 'Received: from custom.smtp.internal; X-Mailer: MyApp v1';
    expect(detectESPFromHeaders(headers)).toBe('Unknown');
  });

  it('detects SendGrid', () => {
    const headers = 'Received: from sendgrid.net (sendgrid.net)';
    expect(detectESPFromHeaders(headers)).toBe('SendGrid');
  });
});
