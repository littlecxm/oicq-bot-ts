import EventListener from '../listener/events';
import logger from '../utils/logger';

/**
 * 监听上线事件
 */
export default class OnlineEvent extends EventListener {
  constructor() {
    super({
      event: 'system.online',
      once: true,
    });
  }

  /** 默认方法 */
  async execute(e: any) {
    /** 上线通知 */
    logger.mark('Bot启动成功');
  }
}
