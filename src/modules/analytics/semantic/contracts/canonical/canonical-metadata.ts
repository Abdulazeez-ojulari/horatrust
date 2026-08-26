export interface CanonicalMetadata {
    readonly dbtVersion?: string;
    readonly metricFlowVersion?: string;
    readonly projectName?: string;
    readonly generatedAt?: string;
    readonly meta?: Readonly<Record<string, unknown>>;
}