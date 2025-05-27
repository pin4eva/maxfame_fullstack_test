import { Request, Response, NextFunction } from 'express';

interface LogData {
  method: string;
  url: string;
  statusCode?: number;
  responseTime?: string;
  userAgent?: string;
  ip: string;
  timestamp: string;
}

export const logger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  // Get client IP
  const ip =
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection as any)?.socket?.remoteAddress ||
    'unknown';

  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function (chunk?: any, encoding?: any) {
    const responseTime = Date.now() - startTime;

    const logData: LogData = {
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: ip,
      timestamp: timestamp,
    };

    // Color coding for different status codes
    const getStatusColor = (status: number): string => {
      if (status >= 500) return '\x1b[31m'; // Red
      if (status >= 400) return '\x1b[33m'; // Yellow
      if (status >= 300) return '\x1b[36m'; // Cyan
      if (status >= 200) return '\x1b[32m'; // Green
      return '\x1b[37m'; // White
    };

    const resetColor = '\x1b[0m';
    const statusColor = getStatusColor(res.statusCode);

    // Format log message
    const logMessage = `${logData.timestamp} ${statusColor}${logData.method}${resetColor} ${logData.url} ${statusColor}${logData.statusCode}${resetColor} ${logData.responseTime} - ${logData.ip}`;

    console.log(logMessage);

    // Call original end function
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const timestamp = new Date().toISOString();
  console.log(
    `[${timestamp}] ${req.method} ${req.originalUrl || req.url} - ${req.ip}`,
  );

  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }

  next();
};
