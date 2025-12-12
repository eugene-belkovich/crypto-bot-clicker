import {plainToInstance} from 'class-transformer';
import {validate, ValidationError as ClassValidatorError} from 'class-validator';
import {ValidationError} from '../errors';

type Constructor<T> = new (...args: any[]) => T;

export async function validateDto<T extends object>(
    dtoClass: Constructor<T>,
    data: unknown
): Promise<T> {
    const dtoInstance = plainToInstance(dtoClass, data);
    const errors = await validate(dtoInstance as object);

    if (errors.length > 0) {
        const formattedErrors = formatValidationErrors(errors);
        throw new ValidationError('Validation failed', formattedErrors);
    }

    return dtoInstance;
}

function formatValidationErrors(errors: ClassValidatorError[]): Record<string, string[]> {
    const formattedErrors: Record<string, string[]> = {};

    for (const error of errors) {
        const constraints = error.constraints;
        if (constraints) {
            formattedErrors[error.property] = Object.values(constraints);
        }

        if (error.children && error.children.length > 0) {
            const nestedErrors = formatValidationErrors(error.children);
            for (const [key, value] of Object.entries(nestedErrors)) {
                formattedErrors[`${error.property}.${key}`] = value;
            }
        }
    }

    return formattedErrors;
}
