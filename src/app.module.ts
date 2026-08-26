import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import configuration from './config/configuration';

import { PrismaModule } from './prisma/prisma.module';
import { AiModule } from './ai/ai.module';
import { AgentModule } from './agent/agent.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
// import { PrepModule } from './prep/prep.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  colorize: true,
                },
              }
            : undefined,
      },
    }),

    // PrismaModule,

    AiModule,
    AgentModule,
    AnalyticsModule,
    // PrepModule,
  ],
})
export class AppModule {}