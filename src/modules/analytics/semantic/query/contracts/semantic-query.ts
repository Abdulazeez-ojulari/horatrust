import { SemanticQueryFilter } from "./semantic-query-filter";
import { SemanticQueryOrder } from "./semantic-query-order";
import { SemanticQueryTimeRange } from "./semantic-query-time-range";

export interface SemanticQuery {
    readonly metrics: readonly string[];
    readonly dimensions: readonly string[];
    readonly filters?: readonly SemanticQueryFilter[];
    readonly orderBy?: readonly SemanticQueryOrder[];
    readonly limit?: number;
    readonly offset?: number;
    readonly timeRange?: SemanticQueryTimeRange;
}