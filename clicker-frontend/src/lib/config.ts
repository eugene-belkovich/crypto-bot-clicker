type EnvironmentConfig = {
    apiUrl: string;
};

const ENV_CONFIG: Record<string, EnvironmentConfig> = {
    'crypto-bot-clicker-frontend-dev.pages.dev': {
        apiUrl: 'https://d2ypsdn3rr.us-east-1.awsapprunner.com'
    },
};

const DEFAULT_CONFIG: EnvironmentConfig = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
};

function getConfig(): EnvironmentConfig {
    if (typeof window === 'undefined') {
        return DEFAULT_CONFIG;
    }

    const hostname = window.location.hostname;
    return ENV_CONFIG[hostname] || DEFAULT_CONFIG;
}

export const config = {
    get apiUrl(): string {
        return getConfig().apiUrl;
    }
};
