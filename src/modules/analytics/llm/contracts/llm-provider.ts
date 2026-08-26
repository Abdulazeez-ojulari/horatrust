import { ExecutiveInsight } from '../../answer/contracts';
import { SemanticQuery } from '../../semantic/query/contracts';
import { LlmProviderType } from './llm-provider.enum';

export interface LlmQueryPlanningRequest {
    readonly question: string;
    readonly semanticContext: unknown;
}

export interface LlmQueryPlanningResponse {
    readonly query: SemanticQuery;
    readonly explanation?: string;
}

export interface LlmExecutiveAnswerResponse {
    readonly summary: string;
    readonly insights: readonly ExecutiveInsight[];
}

export interface LlmProvider {
    readonly type: LlmProviderType;

    generateQueryPlan(
        request: LlmQueryPlanningRequest,
    ): Promise<LlmQueryPlanningResponse>;

    generateExecutiveAnswer(
        request: LlmQueryPlanningRequest,
        systemPrompt: string,
        schema: unknown,
    ): Promise<LlmExecutiveAnswerResponse>;
}