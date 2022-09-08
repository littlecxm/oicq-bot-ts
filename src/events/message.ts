import {
  DiscussMessageEvent,
  GroupMessageEvent,
  PrivateMessageEvent,
} from 'oicq/lib/events.js';
import EventListener from '../listener/events.js';
import logger from '../utils/logger.js';

export default class MessageEvent extends EventListener {
  constructor() {
    super({ prefix: null, event: 'message' });
  }

  async execute(
    e: PrivateMessageEvent | GroupMessageEvent | DiscussMessageEvent,
  ): Promise<void> {
    logger.mark('收到消息', e);
  }
}
