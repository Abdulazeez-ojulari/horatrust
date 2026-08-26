import { Injectable } from '@nestjs/common';
import { OllamaService } from '../../ai/services/ollama.service';
import { REASONING_SYSTEM_PROMPT } from '../prompts/reasoning.prompt';
import {
    ReasoningOutput,
    ReasoningSchema,
} from '../schemas/reasoning.schema';

@Injectable()
export class ReasoningService {
    constructor(
        private readonly ollamaService: OllamaService,
    ) {}

    async analyze(
        question: string,
        data: unknown,
    ): Promise<ReasoningOutput> {
        const response =
            await this.ollamaService.chat(
                `
                ${REASONING_SYSTEM_PROMPT}

                Question:

                ${question}

                Business Data:

                ${JSON.stringify(data, null, 2)}
            `,
            );

        const cleaned = response
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

        return ReasoningSchema.parse(
            JSON.parse(cleaned),
        );
    }
}