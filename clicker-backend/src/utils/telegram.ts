export interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
}

export interface ParsedInitData {
    user: TelegramUser;
    authDate: number;
    hash: string;
}

export function parseInitData(initData: string): ParsedInitData | null {
    if (!initData) return null;

    try {
        const params = new URLSearchParams(initData);
        const userStr = params.get('user');
        const authDate = params.get('auth_date');
        const hash = params.get('hash');

        if (!userStr || !authDate || !hash) return null;

        const user = JSON.parse(userStr) as TelegramUser;

        return {
            user,
            authDate: parseInt(authDate, 10),
            hash,
        };
    } catch {
        return null;
    }
}
