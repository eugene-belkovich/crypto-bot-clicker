import pino from 'pino';
import {config} from './config';

const logger = pino({
    level: config.logging.level,
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname'
        }
    }
});

console.log = logger.info.bind(logger);
console.info = logger.info.bind(logger);
console.warn = logger.warn.bind(logger);
console.debug = logger.debug.bind(logger);
console.error = logger.error.bind(logger);

export default logger;
