export interface DbtSavedQueryExport {
    name: string;
    alias?: string;
}

export interface DbtSavedQueryDto {
    /**
     * Saved query name.
     */
    name: string;

    /**
     * Optional description.
     */
    description?: string;

    /**
     * Metrics.
     */
    metrics: string[];

    /**
     * Dimensions.
     */
    dimensions?: string[];

    /**
     * Optional where clause.
     */
    where?: string;

    /**
     * Optional exports.
     */
    exports?: DbtSavedQueryExport[];

    /**
     * Metadata.
     */
    meta?: Record<string, unknown>;
}