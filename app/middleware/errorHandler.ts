import { CustomError } from '../custom-errors/customErrors';

export const _errorHandler = (err: any, req: any, res: any, next: any) => {
  if (err instanceof CustomError) {
    res
      .status(err.statusCode)
      .json({ error: err.name, errorMessage: err.message, success: false });
  } else {
    res.status(500).json({
      error: 'Internal Server Error',
      errorMessage: err?.message || 'Something went wrong',
      success: false,
    });
  }
};
