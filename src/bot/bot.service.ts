import { Injectable, OnModuleInit } from '@nestjs/common';
import { Bot, Context } from 'grammy';
import { MESSAGE_TEXT } from '../core/consts/message-text';
import { zovCheck } from '../core/utils/zov-check';

@Injectable()
export class BotService implements OnModuleInit {
  private bot: Bot<Context>;

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
    this.bot.on('message', (ctx) => this.messageHandler(ctx));
  }

  private async messageHandler(ctx: Context) {
    if (ctx.message?.text && zovCheck(ctx.message?.text)) {
      return await ctx.reply(MESSAGE_TEXT.ZOV, {
        reply_to_message_id: ctx.message.message_id,
      });
    }
    const isNikita = ctx.message!.from.username === 'iambelov';
    if (!isNikita) {
      return;
    }
    console.debug('никитос чето написал', ctx.message?.text);

    if (ctx.message!.video_note) {
      return await ctx.replyWithPoll(
        'Вам нравятся кружочки Никиты?',
        [{ text: 'Да' }, { text: 'Нет' }],
        { is_anonymous: false },
      );
    }
    await ctx.react('🤡');
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
}
