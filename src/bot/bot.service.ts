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
      if (ctx.message?.text?.includes('Z')) {
        await ctx.reply(`Слава Богу Z🙏❤️СЛАВА Z🙏❤️АНГЕЛА ХРАНИТЕЛЯ Z КАЖДОМУ ИЗ ВАС🙏❤️БОЖЕ ХРАНИ Z🙏❤️СПАСИБО ВАМ НАШИ СВО🙏🏼❤️🇷🇺 ХРАНИ ZOV✊🇷🇺💯СПАСИБО НАШСлава Богу ZСлава Богу Z🙏❤️СЛАВА Z🙏❤️АНГЕЛА ХРАНИТЕЛЯ Z КАЖДОМУ ИЗ ВАС🙏❤️БОЖЕ ХРАНИ Z🙏❤️СПАСИБО ВАМ НАШИ СВО🙏🏼❤️🇷🇺 ХРАНИ ZOV✊🇷🇺💯СПАСИБО НАШСлава Богу ZСлава Богу Z🙏❤️СЛАВА Z🙏❤️АНГЕЛА ХРАНИТЕЛЯ Z КАЖДОМУ ИЗ ВАС🙏❤️БОЖЕ ХРАНИ Z🙏❤️СПАСИБО ВАМ НАШИ СВО🙏🏼❤️🇷🇺 ХРАНИ ZOV✊🇷🇺💯СПАСИБО НАШСлава Богу Z
`);
      }
      const isNikita = ctx.message.from.username === 'iambelov';
      if (!isNikita) {
        return;
      }
      if (ctx.message?.text?.includes('?')) {
        return await ctx.reply('Да.', {
          reply_to_message_id: ctx.message.message_id,
        });
      }
      if (ctx.message.video_note) {
        return await ctx.replyWithPoll('Вам нравятся кружочки Никиты?', [
          { text: 'Да' },
          { text: 'Нет' },
        ]);
      }

      await ctx.api.setMessageReaction(ctx.chat.id, ctx.message.message_id, [
        { type: 'emoji', emoji: '🤡' },
      ]);
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
