import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import { LlmExecutiveAnswerResponse, LlmProvider, LlmProviderType, LlmQueryPlanningRequest, LlmQueryPlanningResponse } from '../contracts';
import { OpenAiConfig } from './openai.config';
import { semanticQueryJsonSchema } from './openai-semantic-query.schema';
import { SEMANTIC_QUERY_SYSTEM_PROMPT } from './openai-semantic-query.prompt';

@Injectable()
export class OpenAiLlmProvider implements LlmProvider {

    readonly type = LlmProviderType.OPENAI;
    private readonly client: OpenAI;

    constructor(
        private readonly config: OpenAiConfig,
    ) {

        this.client =
            new OpenAI({
                apiKey: this.config.apiKey,
                timeout: this.config.timeoutMs,
            });
    }

    async generateQueryPlan(
        request: LlmQueryPlanningRequest,
    ): Promise<LlmQueryPlanningResponse> {

        try {

            const response =
                await this.client.responses.create({
                    model: this.config.model,
                    instructions: SEMANTIC_QUERY_SYSTEM_PROMPT,
                    input: JSON.stringify({
                        question: request.question,
                        semanticContext: request.semanticContext,
                    }),
                    text: {
                        format: {
                            type: 'json_schema',
                            name: 'semantic_query',
                            strict: true,
                            schema: semanticQueryJsonSchema,
                        },
                    },
                });

            const output = response.output_text;

            if (!output?.trim()) {
                throw new Error(
                    'OpenAI returned an empty query plan.',
                );
            }

            const query = JSON.parse(output);

            return {
                query,
            };

        } catch (error) {

            if (
                error instanceof InternalServerErrorException
            ) {
                throw error;
            }

            throw new InternalServerErrorException(
                `OpenAI query planning failed: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`,
            );
        }
    }

    async generateExecutiveAnswer(
        request: LlmQueryPlanningRequest,
        systemPrompt: string,
        schema: unknown,
    ): Promise<LlmExecutiveAnswerResponse> {

        try {

            const response =
                await this.client.responses.create({
                    model: this.config.model,
                    instructions: systemPrompt,
                    input: JSON.stringify(request.semanticContext),
                    text: {
                        format: {
                            type: 'json_schema',
                            name: 'executive_answer',
                            strict: true,
                            schema: schema as Record<string, unknown>,
                        },
                    },
                });

            const output = response.output_text;

            if (!output?.trim()) {
                throw new Error(
                    'OpenAI returned an empty executive answer.',
                );
            }

            return JSON.parse(output) as LlmExecutiveAnswerResponse;

        } catch (error) {
            throw new InternalServerErrorException(
                `OpenAI executive answer generation failed: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`,
            );
        }
    }
}