import { EventMap } from 'oicq/lib/events.js';

type Prefix = string | null;
type Event = string | Array<string>;

interface EventData {
  prefix?: Prefix;
  event: Event;
  once?: boolean;
}

export default abstract class EventListener {
  prefix: Prefix;
  event: Event;
  once: boolean;

  /**
   * 事件监听
   * @param data.prefix 事件名称前缀
   * @param data.event 监听的事件
   */
  constructor(data: EventData) {
    this.prefix = data.prefix || '';
    this.event = data.event;
    this.once = data.once || false;
  }

  // 默认方法
  abstract execute(e: any): void;
}
