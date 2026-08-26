import { SemanticQuery } from './semantic-query';
import { SemanticQueryResult } from './semantic-query-result';

export interface SemanticQueryEngine {
    execute(
        query: SemanticQuery,
    ): Promise<SemanticQueryResult>;
}