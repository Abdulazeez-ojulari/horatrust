export interface CanonicalSavedQueryExport {
    readonly name: string;
    readonly alias?: string;
}

export interface CanonicalSavedQuery {
    readonly name: string;
    readonly description?: string;
    readonly metrics: readonly string[];
    readonly dimensions: readonly string[];
    readonly where?: string;
    readonly exports: readonly CanonicalSavedQueryExport[];
    readonly metadata?: Readonly<Record<string, unknown>>;
}