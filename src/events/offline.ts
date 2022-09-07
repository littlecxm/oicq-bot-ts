import EventListener from '../listener/events';
import logger from '../utils/logger';

/**
 * 监听上线事件
 */
export default class OnlineEvent extends EventListener {
  constructor() {
    super({
      prefix: 'system.offline',
      event: ['network', 'kickoff'],
      once: true,
    });
  }

  /** 默认方法 */
  async execute(e: any) {
    logger.error('掉线了');
  }
}
