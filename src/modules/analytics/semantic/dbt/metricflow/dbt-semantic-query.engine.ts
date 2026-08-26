import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { SemanticQuery, SemanticQueryEngine, SemanticQueryResult } from '../../query/contracts';
import { MetricFlowClient } from './metricflow.client';
import { MetricFlowQueryMapper } from './metricflow-query.mapper';
import { MetricFlowResultMapper } from './metricflow-result.mapper';
import { DbtSemanticQueryValidator } from './query-validator';
import { SemanticModelCache } from '../../cache/semantic-model-cache';

@Injectable()
export class DbtSemanticQueryEngine implements SemanticQueryEngine {

    constructor(
        private readonly client: MetricFlowClient,
        private readonly queryMapper: MetricFlowQueryMapper,
        private readonly resultMapper: MetricFlowResultMapper,
        private readonly validator: DbtSemanticQueryValidator,
        private readonly cache: SemanticModelCache,
    ) {}

    async execute(
        query: SemanticQuery,
    ): Promise<SemanticQueryResult> {

        const model = this.cache.get();

        if (!model) {
            throw new ServiceUnavailableException(
                'No dbt semantic model is loaded.',
            );
        }

        this.validator.validate(
            query,
            model,
        );

        const request = this.queryMapper.map(query);
        console.log(request, "dfsfwe")
        const response = await this.client.query(request);

        console.log(response, "tyyet")

        return this.resultMapper.map(response);
    }
}