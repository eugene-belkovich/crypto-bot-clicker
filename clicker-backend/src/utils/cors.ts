import type {FastifyInstance} from 'fastify';
import cors from '@fastify/cors';

function normalizeOrigin(value: string): string | null {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export async function registerCors(fastify: FastifyInstance) {
  const originsEnv = process.env.ALLOWED_ORIGINS?.trim();
  const allowAll = originsEnv === '*';

  const allowed = allowAll
    ? []
    : (originsEnv?.split(',') || [])
        .map(s => s.trim())
        .filter(Boolean)
        .map(o => normalizeOrigin(o))
        .filter((o): o is string => Boolean(o));

  const allowedSet = new Set(allowed);

  await fastify.register(cors, {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowAll) return cb(null, true);
      const normalized = normalizeOrigin(origin);
      if (normalized && allowedSet.has(normalized)) return cb(null, true);
      cb(new Error('CORS: origin not allowed'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Telegram-Init-Data'],
  });
}
