export interface MetricFlowQueryRequest {
    readonly metrics: readonly string[];
    readonly groupBy?: readonly string[];
    readonly where?: readonly string[];
    readonly orderBy?: readonly string[];
    readonly limit?: number;
    readonly offset?: number;
}

export interface MetricFlowQueryResponse {
    readonly columns: readonly string[];
    readonly data: readonly unknown[][];
    readonly rowCount?: number;
}