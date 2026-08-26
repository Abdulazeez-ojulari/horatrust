import { Injectable } from '@nestjs/common';
import { LLMService } from '../../ai/llm.service';
import { buildQuestionAnalysisPrompt } from '../prompts/question-analysis.prompt';
import { QuestionAnalysis, QuestionAnalysisSchema } from '../../ai/analysis.schema';

@Injectable()
export class QuestionAnalysisService {
  constructor(
    private readonly llm: LLMService,
  ) {}

  async analyze(
    question: string,
  ): Promise<QuestionAnalysis> {
    const prompt = buildQuestionAnalysisPrompt(question);

    return this.llm.generateStructured(
      [
        {
          role: 'system',
          content:
            'You are an expert business planning assistant.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      QuestionAnalysisSchema,
    );
  }
}