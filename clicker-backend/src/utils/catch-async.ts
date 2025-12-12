import { RepositoryError } from '../errors';

type AsyncFunction<T> = (...args: any[]) => Promise<T>;

export const catchAsync = <T>(fn: AsyncFunction<T>): AsyncFunction<T> => {
  return async (...args: any[]): Promise<T> => {
    try {
      return await fn(...args);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown database error';
      throw new RepositoryError(`Database operation failed: ${message}`, 500);
    }
  };
};
