import inquirer from 'inquirer';
import { Client } from 'oicq';
import { trim } from 'lodash-es';
import EventListener from '../listener/events.js';
import { sleep } from '../utils/index.js';
import logger from '../utils/logger.js';
import fetch from 'node-fetch';

export default class LoginHandler extends EventListener {
  client: Client;
  constructor() {
    super({
      prefix: 'system.login.',
      event: ['qrcode', 'slider', 'device', 'error'],
    });
  }

  async execute(event) {}

  async qrcode(event: { image: Buffer }) {
    let time = 0;
    let interval = setInterval(async () => {
      time++;
      let res = await this.client.queryQrcodeResult();
      if (res.retcode === 0) {
        logger.info('扫码成功，开始登录..');
        await sleep(1000);
        this.client.qrcodeLogin();
        clearInterval(interval);
      }
      if (time >= 150) {
        clearInterval(interval);
        logger.error('等待扫码超时，已停止运行');
        process.exit();
      }
    }, 2000);

    inquirer
      .prompt([
        {
          type: 'Input',
          message: '回车刷新二维码，等待扫码中...\n',
          name: 'enter',
        },
      ])
      .then(async () => {
        clearInterval(interval);
        console.log('  重新刷新二维码...\n\n');
        await sleep(1000);
        this.client.fetchQrcode();
      });
  }

  /**
   * 收到滑动验证码提示后，必须使用手机拉动，PC浏览器已经无效
   * https://github.com/takayama-lily/oicq/wiki/01.使用密码登录-(滑动验证码教程)
   */
  async slider(event: { url: string }) {
    console.log(
      `\n\n------------------${logger.green(
        '↓↓滑动验证链接↓↓',
      )}----------------------\n`,
    );
    console.log(logger.green(event.url));
    console.log('\n--------------------------------------------------------');
    console.log(
      `提示：打开上面链接获取ticket，可使用${logger.green(
        '【滑动验证app】',
      )}获取`,
    );
    console.log(
      `链接存在${logger.green(
        '有效期',
      )}，请尽快操作，多次操作失败可能会被冻结`,
    );
    console.log(
      '滑动验证app下载地址：https://wwp.lanzouy.com/i6w3J08um92h 密码:3kuu\n',
    );

    const ret = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: '触发滑动验证，需要获取ticket通过验证，请选择获取方式:',
        choices: ['1.手动获取ticket', '2.滑动验证app请求码获取'],
      },
    ]);

    await sleep(200);
    let ticket;

    if (ret.type == '2.滑动验证app请求码获取') {
      ticket = await this.requestCode(event.url);
      if (!ticket) console.log('\n请求错误，返回手动获取ticket方式\n');
    }

    if (!ticket) {
      let res = await inquirer.prompt([
        {
          type: 'Input',
          message: '请输入ticket:',
          name: 'ticket',
          validate(value) {
            if (!value) return 'ticket不能为空';
            if (value.toLowerCase() == 'ticket') return '请输入获取的ticket';
            if (value == event.url) return '请勿输入滑动验证链接';
            return true;
          },
        },
      ]);
      ticket = trim(res.ticket, '"');
    }
    global.inputTicket = true;
    this.client.submitSlider(ticket.trim());
  }

  /** 设备锁 */
  async device(event: { url: string; phone: string }) {
    global.inputTicket = false;
    console.log(
      `\n\n------------------${logger.green(
        '↓↓设备锁验证↓↓',
      )}----------------------\n`,
    );
    const ret = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: '触发设备锁验证，请选择验证方式:',
        choices: ['1.网页扫码验证', '2.发送短信验证码到密保手机'],
      },
    ]);

    await sleep(200);

    if (ret.type == '1.网页扫码验证') {
      console.log('\n' + logger.green(event.url) + '\n');
      console.log('请打开上面链接，完成验证后按回车');
      await inquirer.prompt([
        {
          type: 'Input',
          message: '等待操作中...',
          name: 'enter',
        },
      ]);
      await this.client.login();
    } else {
      console.log('\n');
      this.client.sendSmsCode();
      await sleep(200);
      logger.info(`验证码已发送：${event.phone}\n`);
      let res = await inquirer.prompt([
        {
          type: 'Input',
          message: '请输入短信验证码:',
          name: 'sms',
        },
      ]);
      this.client.submitSmsCode(res.sms);
    }
  }

  private async requestCode(url: string) {
    let code: string;
    const reqUrl = url.replace('ssl.captcha.qq.com', 'txhelper.glitch.me');
    const resp = await fetch(reqUrl);
    if (!resp.ok) return false;

    const respData = await resp.text();
    if (!respData.includes('使用请求码')) return false;

    const regCode = /\d+/g.exec(respData);
    if (!regCode) return false;

    console.log(
      `\n请打开滑动验证app，输入请求码${logger.green(
        '【' + regCode + '】',
      )}，然后完成滑动验证\n`,
    );

    await sleep(200);
    await inquirer.prompt([
      {
        type: 'Input',
        message: '验证完成后按回车确认，等待在操作中...',
        name: 'enter',
      },
    ]);

    const resp2 = await fetch(reqUrl).catch((err) =>
      console.log(err.toString()),
    );
    if (!resp2) return false;
    const respData2 = await resp2.text();

    if (!respData) return false;
    if (respData == respData2) {
      console.log('\n未完成滑动验证');
      return false;
    }

    console.log(`\n获取ticket成功：\n${respData}\n`);
    return trim(respData);
  }
}
