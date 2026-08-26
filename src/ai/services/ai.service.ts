import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { OllamaService } from './ollama.service';

@Injectable()
export class AIService {
    constructor(
        private readonly ollamaService: OllamaService,
        private readonly configService: ConfigService,
    ) {}

    async chat(prompt: string) {
        console.log(prompt)
        const response = await this.ollamaService.chat(prompt);

        return {
            success: true,
            data: {
                provider: 'ollama',
                model: this.configService.get<string>('ollama.model'),
                response,
            },
        };
    }
}