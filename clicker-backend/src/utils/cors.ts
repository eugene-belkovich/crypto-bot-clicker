import type {FastifyInstance} from 'fastify';
import cors from '@fastify/cors';
import {config} from '../config';

function normalizeOrigin(value: string): string | null {
    try {
        return new URL(value).origin;
    } catch {
        return null;
    }
}

export async function registerCors(fastify: FastifyInstance) {
    const fromConfig = (config as any)?.cors?.origins as string[] | undefined;
    const fromEnv =
        process.env.ALLOWED_ORIGINS?.split(',')
            .map(s => s.trim())
            .filter(Boolean) || [];
    const allowed = Array.from(new Set([...(fromConfig || []), ...fromEnv]))
        .map(o => normalizeOrigin(o))
        .filter((o): o is string => Boolean(o));

    const allowedSet = new Set(allowed);

    await fastify.register(cors, {
        origin: (origin, cb) => {
            if (!origin) return cb(null, true);
            const normalized = normalizeOrigin(origin);
            if (normalized && allowedSet.has(normalized)) return cb(null, true);
            cb(new Error('CORS: origin not allowed'), false);
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Telegram-Init-Data'],
    });
}
