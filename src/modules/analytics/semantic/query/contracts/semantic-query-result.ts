export interface SemanticQueryColumn {
    readonly name: string;
    readonly type?: string;
}

export interface SemanticQueryResult {
    readonly columns: readonly SemanticQueryColumn[];
    readonly rows: readonly Record<string, unknown>[];
    readonly rowCount: number;
    readonly executionTimeMs?: number;
    readonly metadata?: Readonly<Record<string, unknown>>;
}