import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AIController } from './controllers/ai.controller';
import { AIService } from './services/ai.service';
import { OllamaService } from './services/ollama.service';

@Module({
    imports: [
        ConfigModule,
    ],

    controllers: [
        AIController,
    ],

    providers: [
        AIService,
        OllamaService,
    ],

    exports: [
        AIService,
        OllamaService,
    ],
})
export class AiModule {}