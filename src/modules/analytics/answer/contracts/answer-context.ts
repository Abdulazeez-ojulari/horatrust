import { SemanticQuery, SemanticQueryResult } from '../../semantic/query/contracts';
import { ExecutiveInsight } from './executive-insight';

export interface AnswerContext {
    readonly question: string;
    readonly query: SemanticQuery;
    readonly result: SemanticQueryResult;
    readonly insights: readonly ExecutiveInsight[];
}