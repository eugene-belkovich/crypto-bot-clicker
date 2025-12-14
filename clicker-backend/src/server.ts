import 'reflect-metadata';
import dotenv from 'dotenv';
import './utils/logger';
import Fastify, {FastifyError, FastifyReply, FastifyRequest} from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import sensible from '@fastify/sensible';

import {config, connectToDatabase} from './config';
import {registerRoutes} from './routes';
import {ApplicationError, BannedError, ValidationError} from './errors';
import {logger} from './utils';

dotenv.config();

const PORT = config.server.port;
const HOST = config.server.host;

async function bootstrap() {
    const fastify = Fastify({
        logger: false,
    });

    await fastify.register(cors, {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Telegram-Init-Data'],
    });

    await fastify.register(helmet, {
        contentSecurityPolicy: false,
    });

    await fastify.register(rateLimit, {
        max: 200,
        timeWindow: '1 minute',
        keyGenerator: (request) => {
            const telegramUser = request.telegramUser?.user;
            return telegramUser?.id?.toString() || request.ip;
        },
        errorResponseBuilder: () => ({
            error: 'Too many requests',
            message: 'Rate limit exceeded. Try again later.',
        }),
    });

    await fastify.register(sensible);

    fastify.setErrorHandler(
        (error: FastifyError | ApplicationError, request: FastifyRequest, reply: FastifyReply) => {
            logger.error('Request error:', error.message, 'url:', request.url, 'method:', request.method);

            if (error instanceof ValidationError) {
                return reply.status(400).send({
                    statusCode: 400,
                    error: 'Validation Error',
                    message: error.message,
                    errors: error.errors,
                });
            }

            if (error instanceof BannedError) {
                return reply.status(403).send({
                    error: error.message,
                    banned: true,
                    banReason: error.reason,
                });
            }

            if (error instanceof ApplicationError) {
                return reply.status(error.statusCode).send({
                    statusCode: error.statusCode,
                    error: error.name,
                    message: error.message,
                });
            }

            if (error.validation) {
                return reply.status(400).send({
                    statusCode: 400,
                    error: 'Validation Error',
                    message: 'Request validation failed',
                    errors: error.validation,
                });
            }

            const statusCode = error.statusCode || 500;
            return reply.status(statusCode).send({
                statusCode,
                error: 'Internal Server Error',
                message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message,
            });
        }
    );

    fastify.setNotFoundHandler((request, reply) => {
        reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: `Route ${request.method}:${request.url} not found`,
        });
    });

    await registerRoutes(fastify);

    const dbConnection = await connectToDatabase();
    if (!dbConnection) {
        logger.error('Failed to connect to database. Exiting...');
        process.exit(1);
    }

    try {
        await fastify.listen({port: PORT, host: HOST});
        logger.info(`Server is running on http://${HOST}:${PORT}`);
    } catch (err) {
        logger.error('Error starting server:', err);
        process.exit(1);
    }

    const shutdown = async (signal: string) => {
        logger.info(`Received ${signal}. Shutting down gracefully...`);
        try {
            await fastify.close();
            logger.info('Server closed');
            process.exit(0);
        } catch (err) {
            logger.error('Error during shutdown:', err);
            process.exit(1);
        }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('uncaughtException', (err) => {
        logger.error('Uncaught Exception:', err);
        process.exit(1);
    });

    process.on('unhandledRejection', (err) => {
        logger.error('Unhandled Rejection:', err);
        process.exit(1);
    });
}

bootstrap();
