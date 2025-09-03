export function detectESPFromHeaders(headersText: string): string {
  const text = (headersText || '').toLowerCase();
  if (/amazonses|ses-.*amazonaws|x-ses-/.test(text)) return 'Amazon SES';
  if (/sendgrid\.net|x-sg-/.test(text)) return 'SendGrid';
  if (/mailgun|x-mailgun/.test(text)) return 'Mailgun';
  if (/mandrill|mailchimp|mcsv\.net/.test(text)) return 'Mailchimp/Mandrill';
  if (/zoho\./.test(text)) return 'Zoho Mail';
  if (/protection\.outlook\.com|office365|outlook\.com/.test(text)) return 'Microsoft 365/Outlook';
  if (/google\.com|gmail\.com|mail-\w+\.google\./.test(text)) return 'Gmail';
  return 'Unknown';
}
