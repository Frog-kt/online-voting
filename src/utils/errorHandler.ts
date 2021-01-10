class ErrorHandler extends Error {
  public statusCode: number;
  public name: string;
  public path: string;
  public code: number;
  public errors: Error[];
  public keyValue: { key: string };

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
