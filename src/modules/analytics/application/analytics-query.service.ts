import { Injectable, BadRequestException } from '@nestjs/common';
import { LlmProviderType } from '../llm/contracts';
import { SemanticProviderType } from '../semantic/contracts';
import { SemanticQuery, SemanticQueryResult } from '../semantic/query/contracts';
import { LlmProviderRegistry } from '../llm/registry/llm-provider.registry';
import { SemanticQueryPlanner } from '../llm/planner/semantic-query-planner';
import { SemanticProviderRegistry } from '../semantic/registry/semantic-provider.registry';
import { InsightAnalyzer } from '../answer/analysis/insight-analyzer';
import { AnswerContextBuilder } from '../answer/analysis/answer-context.builder';
import { ExecutiveAnswerGenerator } from '../answer/generator';
import { ExecutiveAnswer } from '../answer/contracts';

export interface AnalyticsQueryResponse {
    readonly query: SemanticQuery;
    readonly result: SemanticQueryResult;
}

@Injectable()
export class AnalyticsQueryService {

    constructor(
        private readonly llmRegistry: LlmProviderRegistry,
        private readonly queryPlanner: SemanticQueryPlanner,
        private readonly semanticRegistry: SemanticProviderRegistry,
        private readonly insightAnalyzer: InsightAnalyzer,
        private readonly answerContextBuilder: AnswerContextBuilder,
        private readonly answerGenerator: ExecutiveAnswerGenerator,
    ) {}

    async query(
        question: string,
        tenantId: string,
        projectId: string,
        options?: {
            readonly llmProvider?: LlmProviderType;
            readonly semanticProvider?: SemanticProviderType;
        },
    ): Promise<ExecutiveAnswer> {

        if (!question?.trim()) {
            throw new BadRequestException(
                'Analytics question is required.',
            );
        }

        const llmProvider = this.llmRegistry.get(options?.llmProvider ?? LlmProviderType.OPENAI);

        const semanticProvider =
            this.semanticRegistry.get(
                options?.semanticProvider ?? SemanticProviderType.DBT,
            );

        /*
        * 1. Natural language
        *        ↓
        *    SemanticQuery
        */
        const semanticQuery =
            await this.queryPlanner.plan(
                question,
                llmProvider,
            );

        /*
        * 2. Execute against semantic layer
        */
        const queryEngine = semanticProvider.getQueryEngine?.();

        if (!queryEngine) {
            throw new Error(
                `Semantic provider '${semanticProvider.type}' ` +
                `does not expose a query engine.`,
            );
        }

        const result: SemanticQueryResult = await queryEngine.execute(semanticQuery);

        /*
        * 3. Analyze verified result
        */
        const insights = this.insightAnalyzer.analyze(semanticQuery, result);

        /*
        * 4. Build answer context
        */
        const answerContext =
            this.answerContextBuilder.build(
                question,
                semanticQuery,
                result,
                insights,
            );

        /*
        * 5. Generate executive answer
        */
        return await this.answerGenerator.generate(
            answerContext,
            llmProvider,
        );
    }
}


// async query(
//         question: string,
//         options?: {
//             readonly llmProvider?: LlmProviderType;
//             readonly semanticProvider?: SemanticProviderType;
//         },
//     ): Promise<AnalyticsQueryResponse> {

//         if (!question?.trim()) {
//             throw new BadRequestException(
//                 'Analytics question is required.',
//             );
//         }

//         const llmProvider = this.llmRegistry.get( options?.llmProvider ?? LlmProviderType.OPENAI );
//         const semanticProvider = this.semanticRegistry.get( options?.semanticProvider ?? SemanticProviderType.DBT );
//         const semanticQuery = await this.queryPlanner.plan( question, llmProvider );
//         // console.log(semanticQuery)
//         /*
//          * The semantic provider is responsible for
//          * validating and executing the canonical query.
//          */

//         const queryEngine = semanticProvider.getQueryEngine?.();

//         if (!queryEngine) {
//             throw new Error(
//                 `Semantic provider '${semanticProvider.type}' ` +
//                 `does not expose a query engine.`,
//             );
//         }

//         const result = await queryEngine.execute(semanticQuery);

//         return {
//             query: semanticQuery,
//             result,
//         };
//     }