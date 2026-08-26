import { SemanticQueryResult } from '../../semantic/query/contracts';

export class AnalyticsQueryResponseDto {
    query!: {
        metrics: readonly string[];
        dimensions: readonly string[];
        filters?: readonly unknown[];
        orderBy?: readonly unknown[];
        limit?: number;
        offset?: number;
        timeRange?: unknown;
    };
    result!: SemanticQueryResult;
}