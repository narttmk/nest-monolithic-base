/* eslint-disable @typescript-eslint/no-unsafe-call */

import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

const customLogFormat = winston.format.printf(({ timestamp, level, message, ...meta }) => {
  // const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return `[${timestamp}] [${level.toUpperCase()}] [${meta.context}]: ${message}`;
});

export const loggerConfig: WinstonModuleOptions = {
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        customLogFormat,
        winston.format.colorize({ all: true }),
      ),
    }),
    // Rotating file transport for general logs
    new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(winston.format.timestamp(), customLogFormat),
    }),
    // Rotating file transport for error logs
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
      format: winston.format.combine(winston.format.timestamp(), customLogFormat),
    }),
  ],
};
