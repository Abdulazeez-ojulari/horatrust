import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LlmProvider, LlmQueryPlanningRequest } from '../../llm/contracts';
import { AnswerContext, ExecutiveAnswer } from '../contracts';
import { EXECUTIVE_ANSWER_SYSTEM_PROMPT } from './executive-answer.prompt';
import { executiveAnswerJsonSchema } from './executive-answer.schema';

@Injectable()
export class ExecutiveAnswerGenerator {

    async generate(
        context: AnswerContext,
        provider: LlmProvider,
    ): Promise<ExecutiveAnswer> {

        try {

            const request: LlmQueryPlanningRequest = {
                question: context.question,
                semanticContext: {
                    answerContext: context,
                },
            };

            const response =
                await provider.generateExecutiveAnswer(
                    request,
                    EXECUTIVE_ANSWER_SYSTEM_PROMPT,
                    executiveAnswerJsonSchema,
                );

            console.log(response, "sefwwd")

            return {
                summary: response?.summary || "SUMMARY IS EMPTY OR UNDEFINED",
                insights: response?.insights || "INSIGHTS IS EMPTY OR UNDEFINED",
                query: context.query,
                supportingData: context.result,
            };

        } catch (error) {

            throw new InternalServerErrorException(
                `Executive answer generation failed: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`,
            );
        }
    }
}