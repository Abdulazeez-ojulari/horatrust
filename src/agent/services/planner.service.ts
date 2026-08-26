import { Injectable } from '@nestjs/common';
import { OllamaService } from '../../ai/services/ollama.service';
import { PlannerSchema } from '../schemas/planner.schema';
import { PLANNER_SYSTEM_PROMPT } from '../prompts/planner.prompt';

@Injectable()
export class PlannerService {
  constructor(
    private readonly ollamaService: OllamaService,
  ) {}

  async plan(question: string) {
    const response = await this.ollamaService.chat(
      `
      ${PLANNER_SYSTEM_PROMPT}

      Question:

      ${question}
      `,
    );

    const cleaned = response
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    return PlannerSchema.parse(
      JSON.parse(cleaned),
    );
  }
}