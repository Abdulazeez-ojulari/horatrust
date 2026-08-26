import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ollama from 'ollama';
import { ZodSchema } from 'zod';
import { JsonParserService } from './parser/json-parser.service';

@Injectable()
export class LLMService {
  constructor(
    private readonly config: ConfigService,
    private readonly parser: JsonParserService,
  ) {}

  async generateText(messages: { role: 'system' | 'user' | 'assistant'; content: string }[]): Promise<string> {
    const response = await ollama.chat({
      model: this.config.get<string>('OLLAMA_MODEL')!,
      messages,
    });

    return response.message.content;
  }

  async generateStructured<T>(
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
    schema: ZodSchema<T>,
  ): Promise<T> {
    const text = await this.generateText(messages);

    return this.parser.parse(text, schema);
  }
}