import { Config, LogLevel } from 'oicq';

export const qqNumber: number = parseInt(
  process.env.ACCOUNT_ID || '10000',
  10,
);
export const qqPwd: string | undefined = process.env.ACCOUNT_PWD;
export const qqPlatform: number = parseInt(
  process.env.ACCOUNT_PLATFORM || '1',
  10,
);

const logLevel: string | undefined = process.env.BOT_LOG_LEVEL || 'info';
const ignoreSelf: boolean | undefined =
  process.env.BOT_IGNORE_SELF == 'true' || true;
const resend: boolean | undefined = process.env.BOT_RESEND == 'true' || true;
const dataDir: string | undefined = process.env.BOT_DATA_DIR || '';
export function botConfig(): Config {
  return {
    log_level: logLevel as LogLevel,
    platform: qqPlatform,
    resend,
    ignore_self: ignoreSelf,
    data_dir: dataDir,
  };
}
