import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LlmExecutiveAnswerResponse, LlmProvider, LlmProviderType, LlmQueryPlanningRequest, LlmQueryPlanningResponse } from '../contracts';
import { OllamaConfig } from './ollama.config';
import { SEMANTIC_QUERY_SYSTEM_PROMPT } from './ollama-semantic-query.prompt';
import { Ollama } from 'ollama';
import { semanticQueryJsonSchema } from '../openai/openai-semantic-query.schema';
import fetch from "node-fetch"

@Injectable()
export class OllamaLlmProvider implements LlmProvider {

    private readonly client: Ollama;
    readonly type = LlmProviderType.OLLAMA;

    constructor(
        private readonly config: OllamaConfig,
    ) {
        this.client = new Ollama({
            host: this.config.host,
            fetch: fetch as any
        });
    }

    async generateQueryPlan(
        request: LlmQueryPlanningRequest,
    ): Promise<LlmQueryPlanningResponse> {

        try {

            const prompt = `
                instructions: ${SEMANTIC_QUERY_SYSTEM_PROMPT},
                input: ${JSON.stringify({
                    question: request.question,
                    semanticContext: request.semanticContext,
                })},
                text: {
                    format: {
                        type: 'json_schema',
                        name: 'semantic_query',
                        strict: true,
                        schema: ${JSON.stringify(semanticQueryJsonSchema)},
                    },
                },
            `

            const response = await this.client.chat({
                model: this.config.model,
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            });

            const output = response.message.content;

            console.log(output?.replace(/^`{3}(json)?\s*|\s*`{3}$/g, ''), "dgrg")
            console.log(output?.replace(/^`{3}(json)?\s*|\s*`{3}$/g, '').replace(/`/g, ''), "wew;er")

            console.log(output)

            if (!output?.trim()) {
                throw new Error(
                    'Ollama returned an empty query plan.',
                );
            }

            const query = JSON.parse(output.replace(/^`{3}(json)?\s*|\s*`{3}$/g, '').replace(/`/g, ''));

            return {
                query,
            };

        } catch (error) {

            if (
                error instanceof InternalServerErrorException
            ) {
                throw error;
            }

            console.log(error)

            throw new InternalServerErrorException(
                `Ollama query planning failed: ${
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

            const prompt = `
                instructions: ${systemPrompt},
                input: ${JSON.stringify(request.semanticContext)},
                text: {
                    format: {
                        type: 'json_schema',
                        name: 'executive_answer',
                        strict: true,
                        schema: ${JSON.stringify(schema as Record<string, unknown>)},
                    },
                },
            `

            const response = await this.client.chat({
                model: this.config.model,
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            });

            const output = response.message.content;

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
