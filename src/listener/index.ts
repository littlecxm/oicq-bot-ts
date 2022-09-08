import fs from 'node:fs';
import { isArray } from 'lodash-es';
import { Client } from 'oicq';
import logger from '../utils/logger.js';

class ListenerLoader {
  client: Client;
  /**
   * 监听事件加载
   * @param client
   */
  async load(client: Client) {
    this.client = client;

    const files = fs
      .readdirSync('./src/events')
      .filter((file) => file.endsWith('.js'));

    for (let File of files) {
      try {
        let listener = await import(`../events/${File}`);

        if (!listener.default) continue;
        listener = new listener.default();
        listener.client = this.client;
        const on = listener.once ? 'once' : 'on';

        if (isArray(listener.event)) {
          listener.event.forEach((type: string) => {
            const e = listener[type] ? type : 'execute';
            this.client[on](listener.prefix + type, (event) =>
              listener[e](event),
            );
          });
        } else {
          const e = listener[listener.event] ? listener.event : 'execute';
          this.client[on](listener.prefix + listener.event, (event: string) =>
            listener[e](event),
          );
        }
      } catch (e) {
        logger.mark(`加载模块错误：${File}`);
        logger.error(e);
      }
    }
  }
}
const listener = new ListenerLoader();
export default listener;
