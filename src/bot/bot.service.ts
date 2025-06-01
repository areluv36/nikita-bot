import { Injectable, OnModuleInit } from '@nestjs/common';
import { Bot, Context, InputFile } from 'grammy';
import { MESSAGE_TEXT } from '../core/consts/message-text';
import { zovCheck } from '../core/utils/zov-check';
import { isRussianTextWithWrongLayout } from '../core/consts/check-russian';
import { isUsername } from '../core/utils/check-username';
import { moscowDateConvert } from '../core/utils/moscow-date';
import axios from 'axios';

@Injectable()
export class BotService implements OnModuleInit {
  private bot: Bot<Context>;
  private userClownsMap = new Map<number, NodeJS.Timeout>();
  private lastPidor = '';
  private admins = ['iamevgzap', 'AreLuv36'];

  constructor() {
    if (!process.env.TG_SECRET_KEY) {
      console.error(
        'TG_SECRET_KEY не найден в переменных окружения. Проверьте .env файл',
      );
      return;
    }

    this.bot = new Bot(process.env.TG_SECRET_KEY);
  }

  async onModuleInit() {
    await this.init();
  }

  async init() {
    try {
      await this.initHandlers();
      await this.bot.start();
    } catch (error) {
      console.error('Ошибка при запуске бота:', error);
      throw error;
    }
  }

  private async initHandlers() {
    this.bot.command('start', (ctx) => this.startHandler(ctx));
    this.bot.command('pin', (ctx) => this.pinHandler(ctx));
    this.bot.command('quiz', (ctx) => this.quizHandler(ctx));
    this.bot.command('clowns', (ctx) => this.clownsHandler(ctx));
    this.bot.command('goida', (ctx) => this.goidaHandler(ctx));
    this.bot.hears(/кто пидор/i, (ctx) => this.whoIsHandler(ctx));
    this.bot.hears(/я пидор/i, (ctx) => this.iAmPidor(ctx));
   this.bot.hears(/^курс$/i, (ctx) => this.currencyHandler(ctx));
    this.bot.hears(/гойда/i, (ctx) => this.goidaHandler(ctx));
    this.bot.on('message', (ctx) => this.messageHandler(ctx));
  }

  private async messageHandler(ctx: Context) {
    const chatId = ctx.chat?.id;

    if (!chatId) {
      return;
    }
    if (ctx.message?.text && zovCheck(ctx.message?.text)) {
      return await ctx.reply(MESSAGE_TEXT.ZOV, {
        reply_to_message_id: ctx.message.message_id,
      });
    }

    const correctedText = isRussianTextWithWrongLayout(ctx.message?.text);

    if (
      !isUsername(ctx.message?.text) &&
      correctedText?.corrected &&
      /[aA-zZ]/.test(ctx.message?.text!)
    ) {
      await ctx.replyWithSticker(
        'CAACAgIAAxkBAAICCGg60pC6PScPnkS8OkLOuCO_BhDXAALPcwACtmw4SpuBPwNS9N1pNgQ',
      );
      await ctx.reply(
        `@${ctx.from?.username} хотел сказать: ${correctedText.data}`,
      );
    }
    if (this.userClownsMap.has(chatId)) {
      await ctx.react('🤡');
    }
  }

  private async pinHandler(ctx: Context) {
    if (!ctx.message?.reply_to_message?.message_id) {
      return ctx.reply(MESSAGE_TEXT.NEED_REPLY);
    }
    await ctx.pinChatMessage(ctx.message.reply_to_message.message_id);
  }

  private async startHandler(ctx: Context) {
    await ctx.reply(MESSAGE_TEXT.START);
  }

  private async quizHandler(ctx: Context) {
    return await ctx.replyWithPoll(
      'Что Женя больше всего хочет?',
      [{ text: 'Iphone 17' }, { text: 'Скинуть тяо на хохлов' }],
      { is_anonymous: false, type: 'quiz', correct_option_id: 1 },
    );
  }

  private async clownsHandler(ctx: Context) {
    const chatId = ctx.chat?.id;
    if (!chatId) {
      return;
    }
    if (this.userClownsMap.has(chatId)) {
      clearTimeout(this.userClownsMap.get(chatId)!);
      this.userClownsMap.delete(chatId);
      return await ctx.reply('Клоуны отменены');
    }
    this.userClownsMap.set(
      chatId,
      setTimeout(() => {
        this.userClownsMap.delete(chatId);
        ctx.reply('Клоуны отменены');
      }, 60000),
    );
    return await ctx.reply('Клоуны включены');
  }

  private async goidaHandler(ctx: Context) {
    await ctx.replyWithVoice(new InputFile('./src/core/assets/goida.mp3'));
  }

  private async currencyHandler(ctx: Context) {
    try {
      const response = await axios.get(
        'https://www.cbr-xml-daily.ru/daily_json.js',
      );
      const date = response.data.Date;
      const usd = {
        name: response.data.Valute.USD.Name,
        value: response.data.Valute.USD.Value,
      };
      const gbp = {
        name: response.data.Valute.GBP.Name,
        value: response.data.Valute.GBP.Value,
      };
      const eur = {
        name: response.data.Valute.EUR.Name,
        value: response.data.Valute.EUR.Value,
      };
      const cny = {
        name: response.data.Valute.CNY.Name,
        value: response.data.Valute.CNY.Value,
      };
      await ctx.reply(
        `Курс на ${moscowDateConvert(new Date(date))}\n${usd.name}: ${usd.value}₽\n${gbp.name}: ${gbp.value}₽\n${eur.name}: ${eur.value}₽\n${cny.name}: ${cny.value}₽`,
      );
    } catch (error) {
      await ctx.reply('Ошибка, мемы кончились 😢');
      console.error(error);
    }
  }
  private async whoIsHandler(ctx: Context) {
    const members = [
      'funny_donny_bot',
      'iambelov',
      'iamfedyaev',
      'iamevgzap',
      'AreLuv36',
    ];
    if (!members.includes(ctx.from?.username!)) {
      return;
    }
    const randomMember = members[Math.floor(Math.random() * members.length)];
    this.lastPidor = randomMember;
    await ctx.reply(`@${randomMember} пидор`);
    if (randomMember === 'funny_donny_bot') {
      await ctx.reply(`пиздец я еще и пидор`);
    }
  }
  private iAmPidor(ctx: Context) {
    if (ctx.from?.username === this.lastPidor) {
      return ctx.reply('Да, ты пидор!');
    }
    ctx.reply('Нет(');
  }
}
