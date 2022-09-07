import EventListener from '../listener/events';
import logger from '../utils/logger';

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
