// export type FilterOperator =
//     | 'eq'
//     | 'neq'
//     | 'gt'
//     | 'gte'
//     | 'lt'
//     | 'lte'
//     | 'in'
//     | 'between'
//     | 'contains';

// export interface SemanticFilter {
//     field: string;
//     operator: FilterOperator;
//     value: unknown;
// }

// export interface SemanticSort {
//     field: string;
//     direction: 'asc' | 'desc';
// }

// export interface SemanticQuery {
//     metrics: string[];
//     dimensions: string[];
//     filters: SemanticFilter[];
//     orderBy: SemanticSort[];
//     limit?: number;
// }