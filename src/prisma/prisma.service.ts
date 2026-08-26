import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { LogDefinition, LogLevel, TransactionIsolationLevel } from '../../generated/prisma/internal/prismaNamespace';

@Injectable()
export class PrismaService
    extends PrismaClient<{
        // adapter: PrismaPg;
        log: (LogLevel | LogDefinition)[];
        accelerateUrl: string;
        transactionOptions?: {
            maxWait?: number;
            timeout?: number;
            isolationLevel?: TransactionIsolationLevel;
        };
    }>
    implements OnModuleInit
{
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
      console.log(process.env.DATABASE_URL, "aadsd")
      super({
        accelerateUrl: process.env.DATABASE_URL as string,
        log: [
          {
            emit: 'event',
            level: 'query',
          },
          {
            emit: 'stdout',
            level: 'error',
          },
          {
            emit: 'stdout',
            level: 'warn',
          },
        ],
      });

      this.$on('query', (event) => {
        this.logger.debug(
          `${event.duration}ms | ${event.query}`,
        );
      });
    }

    async onModuleInit() {
      await this.$connect();
      this.logger.log('Connected to PostgreSQL');
    }

    async enableShutdownHooks(app: INestApplication) {
      process.on('beforeExit', async () => {
        await app.close();
      });
    }
}