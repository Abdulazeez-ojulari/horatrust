export enum DbtAggregationType {
    SUM = 'sum',
    MIN = 'min',
    MAX = 'max',
    COUNT = 'count',
    COUNT_DISTINCT = 'count_distinct',
    AVERAGE = 'average',
    MEDIAN = 'median',
    PERCENTILE = 'percentile',
    BOOLEAN = 'boolean',
}

export interface DbtMeasureFilter {
    sql: string;
}

export interface DbtMeasureDto {
    /**
     * Measure name.
     */
    name: string;

    /**
     * Aggregation.
     */
    agg: DbtAggregationType;

    /**
     * SQL expression.
     */
    expr?: string;

    /**
     * Description.
     */
    description?: string;

    /**
     * Optional filter.
     */
    filter?: DbtMeasureFilter;
}