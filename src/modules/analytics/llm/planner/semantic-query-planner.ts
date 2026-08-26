import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { SemanticQuery } from '../../semantic/query/contracts';
import { SemanticModelCache } from '../../semantic/cache/semantic-model-cache';
import { LlmProvider, LlmQueryPlanningRequest } from '../contracts';
import { SemanticContextBuilder } from './semantic-context.builder';

@Injectable()
export class SemanticQueryPlanner {

    constructor(
        private readonly cache: SemanticModelCache,
        private readonly contextBuilder: SemanticContextBuilder,
    ) {}

    async plan(
        question: string,
        provider: LlmProvider,
    ): Promise<SemanticQuery> {

        const model = this.cache.get();

        if (!model) {
            throw new ServiceUnavailableException(
                'No semantic model is loaded.',
            );
        }

        const semanticContext = this.contextBuilder.build(model);
        const request:
            LlmQueryPlanningRequest = {
                question,
                semanticContext,
            };

        // console.log(request, "request")

        const response = await provider.generateQueryPlan(request);

        return response.query;
    }
}