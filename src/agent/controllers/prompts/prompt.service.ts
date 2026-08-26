import { Injectable } from '@nestjs/common';
import { PromptType } from './prompt.types';
import { PROMPTS } from './index';

@Injectable()
export class PromptService {
  get(type: PromptType): string {
    return PROMPTS[type];
  }

  combine(...prompts: string[]): string {
    return prompts.join('\n\n');
  }
}