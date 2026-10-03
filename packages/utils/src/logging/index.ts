export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
  debug: (message: string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
}

export function createLogger(prefix: string, isDebug: boolean = __DEV__): Logger {
  const format = (level: string, msg: string) => `[${prefix}] [${level.toUpperCase()}] ${msg}`;

  return {
    debug: (msg: string, ...args: any[]) => {
      if (isDebug) console.debug(format('debug', msg), ...args);
    },
    info: (msg: string, ...args: any[]) => {
      console.info(format('info', msg), ...args);
    },
    warn: (msg: string, ...args: any[]) => {
      console.warn(format('warn', msg), ...args);
    },
    error: (msg: string, ...args: any[]) => {
      console.error(format('error', msg), ...args);
    },
  };
}
