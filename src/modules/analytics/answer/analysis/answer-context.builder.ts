import { Injectable } from '@nestjs/common';
import { SemanticQuery, SemanticQueryResult } from '../../semantic/query/contracts';
import { AnswerContext, ExecutiveInsight } from '../contracts';

@Injectable()
export class AnswerContextBuilder {

    build(
        question: string,
        query: SemanticQuery,
        result: SemanticQueryResult,
        insights: readonly ExecutiveInsight[],
    ): AnswerContext {

        return {
            question,
            query,
            result,
            insights,
        };
    }
}