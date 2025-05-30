import { Injectable, OnModuleInit } from '@nestjs/common';
import { Bot, Context } from 'grammy';

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

  private async initHandlers() {
    this.bot.command('start', (ctx) => ctx.reply('Шо ты голова'));
    this.bot.on('message', async (ctx) => {
      //   console.log(ctx.message);
      const isNikita = ctx.message.from.username === 'iambelov';
      if (isNikita && ctx.message?.text?.includes('?')) {
        await ctx.reply('Да.', {
          reply_to_message_id: ctx.message.message_id,
        });
      } else if (isNikita && ctx.message.video_note) {
        await ctx.replyWithPoll('Вам нравятся кружочки Никиты?', [
          { text: 'Да' },
          { text: 'Нет' },
        ]);
      } else if (isNikita) {
        await ctx.api.setMessageReaction(ctx.chat.id, ctx.message.message_id, [
          { type: 'emoji', emoji: '🤡' },
        ]);
      }
    });
  }

  async init() {
    try {
      await this.initHandlers();
      await this.bot.start();
      console.log('Бот успешно запущен!');
    } catch (error) {
      console.error('Ошибка при запуске бота:', error);
      throw error;
    }
  }
}
