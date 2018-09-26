export interface ILogger {
  log: (message?: string) => void;
  warn: (message?: string) => void;
  error: (message?: string) => void;
  info: (message?: string) => void;
}

class Logger implements ILogger {
  log = (message: string) => console.log(message);
  warn = (message: string) => console.warn(message);
  error = (message: string) => console.error(message);
  info = (message: string) => console.info(message);
}

// tslint:disable-next-line:max-classes-per-file
class LoggerMock implements ILogger {
  log = (message: string) => {
    return;
  };
  warn = (message: string) => {
    return;
  };
  error = (message: string) => {
    return;
  };
  info = (message: string) => {
    return;
  };
}

export { Logger };
export { LoggerMock };
