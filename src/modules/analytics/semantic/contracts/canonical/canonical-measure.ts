export type CanonicalAggregation =
    | 'sum'
    | 'min'
    | 'max'
    | 'count'
    | 'count_distinct'
    | 'average'
    | 'median'
    | 'percentile'
    | 'boolean';

export interface CanonicalMeasureFilter {
    readonly sql?: string;
}

export interface CanonicalMeasure {
    readonly name: string;
    readonly description?: string;
    readonly expression?: string;
    readonly aggregation: CanonicalAggregation;
    readonly filter?: CanonicalMeasureFilter;
}