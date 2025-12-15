import crypto from 'crypto';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export interface ParsedInitData {
  user: TelegramUser;
  authDate: number;
}

export function isInitDataValid(initData: string): boolean {
  if (process.env.SKIP_TELEGRAM_VALIDATION === 'true') {
    return true;
  }

  // TELEGRAM_BOT_TOKEN is a secret - must remain as env var
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return false;

  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return false;

  params.delete('hash');
  params.sort();

  let dataCheckString = '';
  for (const [key, value] of params.entries()) {
    dataCheckString += `${key}=${value}\n`;
  }
  dataCheckString = dataCheckString.slice(0, -1);

  const secret = crypto.createHmac('sha256', 'WebAppData').update(botToken);
  const calculatedHash = crypto.createHmac('sha256', secret.digest()).update(dataCheckString).digest('hex');

  return calculatedHash === hash;
}

export function parseInitData(initData: string): ParsedInitData | null {
  if (!initData) return null;

  try {
    const params = new URLSearchParams(initData);
    const userStr = params.get('user');
    const authDate = params.get('auth_date');

    if (!userStr || !authDate) return null;

    return {
      user: JSON.parse(userStr) as TelegramUser,
      authDate: parseInt(authDate, 10),
    };
  } catch {
    return null;
  }
}
