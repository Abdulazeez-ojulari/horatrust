import { SemanticQuery, SemanticQueryResult } from '../../semantic/query/contracts';
import { ExecutiveInsight } from './executive-insight';

export interface ExecutiveAnswer {
    readonly summary: string;
    readonly insights: readonly ExecutiveInsight[];
    readonly query: SemanticQuery;
    readonly supportingData: SemanticQueryResult;
}