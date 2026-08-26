export type SemanticFilterOperator =
    | 'eq'
    | 'neq'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'in'
    | 'not_in'
    | 'contains'
    | 'starts_with'
    | 'ends_with'
    | 'is_null'
    | 'is_not_null';

export interface SemanticQueryFilter {
    readonly field: string;
    readonly operator: SemanticFilterOperator;
    readonly value?:
        | string
        | number
        | boolean
        | readonly (
            | string
            | number
            | boolean
        )[];
}