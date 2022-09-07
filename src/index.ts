import 'dotenv/config';
import { createClient } from 'oicq';
import { botConfig, qqNumber, qqPwd } from './config';
import listener from './listener';
import { sleep } from './utils';
import logger from './utils/logger';

process.on('unhandledRejection', (error, promise) => {
  let err = error;
  if (logger) {
    logger.error(err);
  } else {
    console.log(err);
  }
});

(async function () {
  // config
  logger.setLog();
  const client = createClient(qqNumber, botConfig());
  await listener.load(client);
  await client.login(qqPwd);
})();
