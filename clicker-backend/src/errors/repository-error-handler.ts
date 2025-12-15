import {Error as MongooseError} from 'mongoose';
import {MongoServerError} from 'mongodb';
import {BadRequestError, ConflictError, RepositoryError, ValidationError} from './application.error';

export function handleRepositoryError(error: unknown): never {
  // Duplicate key error (E11000)
  if (error instanceof MongoServerError && error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || 'field';
    throw new ConflictError(`Duplicate value for ${field}`);
  }

  // Mongoose validation error
  if (error instanceof MongooseError.ValidationError) {
    const errors: Record<string, string[]> = {};
    for (const [field, err] of Object.entries(error.errors)) {
      errors[field] = [err.message];
    }
    throw new ValidationError('Validation failed', errors);
  }

  // Invalid ObjectId
  if (error instanceof MongooseError.CastError) {
    throw new BadRequestError(`Invalid ${error.path}: ${error.value}`);
  }

  // Document not found (for operations that expect a document)
  if (error instanceof MongooseError.DocumentNotFoundError) {
    throw new BadRequestError('Document not found');
  }

  // Re-throw application errors as-is
  if (error instanceof RepositoryError) {
    throw error;
  }

  // Unknown database error - preserve original message and stack
  const message = error instanceof Error ? error.message : 'Unknown database error';
  const repoError = new RepositoryError(`Database operation failed: ${message}`);
  if (error instanceof Error && error.stack) {
    repoError.stack = error.stack;
  }
  throw repoError;
}

type AsyncRepositoryMethod<T> = (...args: any[]) => Promise<T>;

export function catchError<T>(fn: AsyncRepositoryMethod<T>): AsyncRepositoryMethod<T> {
  return async (...args: any[]): Promise<T> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleRepositoryError(error);
    }
  };
}
