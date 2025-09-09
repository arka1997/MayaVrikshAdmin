interface LogLevel {
  DEBUG: number;
  INFO: number;
  WARN: number;
  ERROR: number;
}

const LOG_LEVELS: LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

class Logger {
  private level: number;

  constructor(level: string = 'info') {
    this.level = LOG_LEVELS[level.toUpperCase() as keyof LogLevel] || LOG_LEVELS.INFO;
  }

  private log(level: keyof LogLevel, message: string, data?: any): void {
    if (LOG_LEVELS[level] >= this.level) {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] [${level}] ${message}`;
      
      if (data) {
        console.log(logMessage, data);
      } else {
        console.log(logMessage);
      }
    }
  }

  debug(message: string, data?: any): void {
    this.log('DEBUG', message, data);
  }

  info(message: string, data?: any): void {
    this.log('INFO', message, data);
  }

  warn(message: string, data?: any): void {
    this.log('WARN', message, data);
  }

  error(message: string, data?: any): void {
    this.log('ERROR', message, data);
  }
}

export const logger = new Logger(import.meta.env.VITE_LOG_LEVEL || 'info');
