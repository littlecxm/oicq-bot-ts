import {
  DiscussMessageEvent,
  GroupMessageEvent,
  PrivateMessageEvent,
} from 'oicq/lib/events';
import EventListener from '../listener/events';
import logger from '../utils/logger';

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
