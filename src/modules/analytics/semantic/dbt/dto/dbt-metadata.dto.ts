export interface DbtSemanticMetadata {
    /**
     * dbt version.
     */
    dbtVersion?: string;

    /**
     * MetricFlow version.
     */
    metricFlowVersion?: string;

    /**
     * Project name.
     */
    projectName?: string;

    /**
     * Generated timestamp.
     */
    generatedAt?: string;

    /**
     * Additional metadata.
     */
    meta?: Record<string, unknown>;
}