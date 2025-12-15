import pino from 'pino';
import {config} from '../config';

const pinoLogger = pino({
  level: config.logging.level,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
    },
  },
});

const formatArgs = (...args: unknown[]): string => {
  return args
    .map(arg => {
      if (arg instanceof Error) {
        return `${arg.message}\n${arg.stack}`;
      }
      return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
    })
    .join(' ');
};

const logger = {
  info: (...args: unknown[]) => pinoLogger.info(formatArgs(...args)),
  warn: (...args: unknown[]) => pinoLogger.warn(formatArgs(...args)),
  error: (...args: unknown[]) => pinoLogger.error(formatArgs(...args)),
  debug: (...args: unknown[]) => pinoLogger.debug(formatArgs(...args)),
  fatal: (...args: unknown[]) => pinoLogger.fatal(formatArgs(...args)),
  trace: (...args: unknown[]) => pinoLogger.trace(formatArgs(...args)),
};

console.log = logger.info;
console.info = logger.info;
console.warn = logger.warn;
console.debug = logger.debug;
console.error = logger.error;

export default logger;
