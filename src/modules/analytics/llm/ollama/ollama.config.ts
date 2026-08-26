import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OllamaConfig {

    constructor(
        private readonly configService: ConfigService,
    ) {}

    // get apiKey(): string {
    //     const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    //     if (!apiKey) {
    //         throw new Error(
    //             'OPENAI_API_KEY is not configured.',
    //         );
    //     }

    //     return apiKey;
    // }

    get model(): string {
        return this.configService.get<string>('ollama.model') ?? 'qwen3:8b';
    }

    // get timeoutMs(): number {
    //     return this.configService.get<number>(
    //         'OPENAI_TIMEOUT_MS',
    //         120000,
    //     );
    // }

    get host(): string | undefined {
        return this.configService.get<string>('ollama.url');
    }
}