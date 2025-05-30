import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotService } from './bot/bot.service';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [ConfigModule.forRoot(), BotModule],
  controllers: [AppController],
  providers: [AppService, BotService],
})
export class AppModule {}
