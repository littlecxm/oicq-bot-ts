import log4js, { Logger as Log4jLogger } from 'log4js';
import chalk from 'chalk';
import fs from 'node:fs';

class Logger {
  // let logger: any;
  defaultLogger = log4js.getLogger('message');
  commandLogger = log4js.getLogger('command');
  errorLogger = log4js.getLogger('error');

  setLog() {
    let file = './logs';
    if (!fs.existsSync(file)) {
      fs.mkdirSync(file);
    }

    /** 调整error日志等级 */
    // log4js.levels.levels[5].level = Number.MAX_VALUE
    // log4js.levels.levels.sort((a, b) => a.level - b.level)

    log4js.configure({
      appenders: {
        console: {
          type: 'console',
          layout: {
            type: 'pattern',
            pattern: '%[[Bot][%d{hh:mm:ss.SSS}][%4.4p]%] %m',
          },
        },
        command: {
          type: 'dateFile', // 可以是console,dateFile,file,Logstash等
          filename: 'logs/command', // 将会按照filename和pattern拼接文件名
          pattern: 'yyyy-MM-dd.log',
          numBackups: 15,
          alwaysIncludePattern: true,
          layout: {
            type: 'pattern',
            pattern: '[%d{hh:mm:ss.SSS}][%4.4p] %m',
          },
        },
        error: {
          type: 'file',
          filename: 'logs/error.log',
          alwaysIncludePattern: true,
          layout: {
            type: 'pattern',
            pattern: '[%d{hh:mm:ss.SSS}][%4.4p] %m',
          },
        },
      },
      categories: {
        default: { appenders: ['console'], level: 'info' },
        command: { appenders: ['console', 'command'], level: 'warn' },
        error: { appenders: ['console', 'command', 'error'], level: 'error' },
      },
    });
  }

  trace(...args: any[]): void {
    this.defaultLogger.trace.call(this.defaultLogger, ...args);
  }
  debug(...args: any[]): void {
    this.defaultLogger.debug.call(this.defaultLogger, ...args);
  }
  info(...args: any[]): void {
    this.defaultLogger.info.call(this.defaultLogger, ...args);
  }
  warn(...args: any[]): void {
    this.defaultLogger.warn.call(this.defaultLogger, ...args);
  }
  error(...args: any[]): void {
    this.errorLogger.error.call(this.errorLogger, ...args);
  }
  fatal(...args: any[]): void {
    this.errorLogger.fatal.call(this.errorLogger, ...args);
  }
  mark(...args: any[]): void {
    this.errorLogger.mark.call(this.commandLogger, ...args);
  }

  chalk = chalk;
  red = chalk.red;
  green = chalk.green;
  yellow = chalk.yellow;
  blue = chalk.blue;
  magenta = chalk.magenta;
  cyan = chalk.cyan;
}
const logger = new Logger();
export default logger;
