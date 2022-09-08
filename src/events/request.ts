import EventListener from '../listener/events.js';
import logger from '../utils/logger.js';

/**
 * 监听请求事件
 */
export default class Request extends EventListener {
  constructor() {
    super({
      event: 'request',
    });
  }

  /** 默认方法 */
  async execute(e: any) {}
}
