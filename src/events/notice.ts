import EventListener from '../listener/events.js';
import logger from '../utils/logger.js';

/**
 * 监听群聊notice事件
 */
export default class NoticeEvent extends EventListener {
  constructor() {
    super({ prefix: null, event: 'notice' });
  }

  async execute(e: any) {
    logger.mark('收到群聊事件', e);
  }
}
