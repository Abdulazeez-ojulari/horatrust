import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Ollama } from 'ollama';

@Injectable()
export class OllamaService {
    private readonly ollama: Ollama;
    private readonly model: string;

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.ollama = new Ollama({
            host: this.configService.get<string>('ollama.url'),
        });

        this.model = this.configService.get<string>('ollama.model') ?? 'qwen3:8b';
    }

    async chat(prompt: string): Promise<string> {
        const response = await this.ollama.chat({
            model: this.model,
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
        });

        return response.message.content;
    }
}