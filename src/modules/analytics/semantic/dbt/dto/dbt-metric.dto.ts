export enum DbtMetricType {
    SIMPLE = 'simple',
    CUMULATIVE = 'cumulative',
    DERIVED = 'derived',
    RATIO = 'ratio',
}

export interface DbtMetricTypeParams {
    measure?: string;
    numerator?: string;
    denominator?: string;
    metrics?: string[];
    expr?: string;
    window?: string;
    grainToDate?: string;
}

export interface DbtMetricFilter {
    where: string;
}

export interface DbtMetricDto {
    /**
     * Metric name.
     */
    name: string;

    /**
     * simple | cumulative | derived | ratio
     */
    type: DbtMetricType;

    /**
     * Metric description.
     */
    description?: string;

    /**
     * Metric label.
     */
    label?: string;

    /**
     * Type specific configuration.
     */
    type_params: DbtMetricTypeParams;

    /**
     * Optional filter.
     */
    filter?: DbtMetricFilter;

    /**
     * Optional metadata.
     */
    meta?: Record<string, unknown>;

    /**
     * Optional config.
     */
    config?: Record<string, unknown>;
}