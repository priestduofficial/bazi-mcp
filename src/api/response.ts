import type { Response } from 'express';
import { ZodError } from 'zod';

type ApiErrorCode = 'VALIDATION_ERROR' | 'INTERNAL_ERROR';

export const sendSuccess = (res: Response, data: unknown, status = 200) => {
  return res.status(status).json({
    ok: true,
    data,
  });
};

export const sendError = (res: Response, status: number, code: ApiErrorCode, message: string) => {
  return res.status(status).json({
    ok: false,
    error: {
      code,
      message,
    },
  });
};

const formatZodError = (error: ZodError) => {
  return error.issues
    .map((issue) => {
      const path = issue.path.join('.');
      return path ? `${path}: ${issue.message}` : issue.message;
    })
    .join('; ');
};

export const handleApiError = (res: Response, error: unknown) => {
  if (error instanceof ZodError) {
    return sendError(res, 400, 'VALIDATION_ERROR', formatZodError(error));
  }

  console.error('API request failed', error);
  return sendError(res, 500, 'INTERNAL_ERROR', 'Internal server error.');
};
