export type CanonicalMetricType =
    | 'simple'
    | 'cumulative'
    | 'derived'
    | 'ratio';

export interface CanonicalMetricTypeParams {
    readonly measure?: string;
    readonly numerator?: string;
    readonly denominator?: string;
    readonly metrics?: readonly string[];
    readonly expr?: string;
    readonly window?: string;
    readonly grainToDate?: string;
}

export interface CanonicalMetricFilter {
    readonly where?: string;
}

export interface CanonicalMetric {
    readonly name: string;
    readonly label?: string;
    readonly description?: string;
    readonly type: CanonicalMetricType;
    readonly typeParams: CanonicalMetricTypeParams;
    readonly filter?: CanonicalMetricFilter;
    readonly metadata?: Readonly<Record<string, unknown>>;
    readonly config?: Readonly<Record<string, unknown>>;
}