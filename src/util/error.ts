export class ServerError extends Error {
  constructor(
    public name: string,
    public description: string = '',
    public data: Record<string, any> = {}
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export enum ErrorType {
  invalidOperation = 'INVALID_OPERATION',
}

export type ErrorName = keyof typeof ErrorType;

type ErrorHandler = (
  description?: string,
  data?: Record<string, any>
) => ServerError;

export const Errors = Object.keys(ErrorType).reduce(
  (previous, name) => ({
    ...previous,
    [name]: (description: string, data: Record<string, any>) => {
      const key = Object.values(ErrorType).indexOf(name as ErrorType);

      return new ServerError(Object.values(ErrorType)[key], description, data);
    },
  }),
  {}
) as Record<ErrorName, ErrorHandler>;
