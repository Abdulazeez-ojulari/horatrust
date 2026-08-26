import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenAiConfig {

    constructor(
        private readonly configService: ConfigService,
    ) {}

    get apiKey(): string {
        const apiKey = this.configService.get<string>('OPENAI_API_KEY');

        if (!apiKey) {
            throw new Error(
                'OPENAI_API_KEY is not configured.',
            );
        }

        return apiKey;
    }

    get model(): string {
        return this.configService.get<string>(
            'OPENAI_MODEL',
            'gpt-5.5',
        );
    }

    get timeoutMs(): number {
        return this.configService.get<number>(
            'OPENAI_TIMEOUT_MS',
            120000,
        );
    }
}