export enum DbtJobStatus {
    QUEUED = 'queued',
    RUNNING = 'running',
    SUCCESS = 'success',
    FAILED = 'failed',
}

export interface DbtValidationJob {
    readonly id: string;
    readonly tenantId: string;
    readonly projectId: string;
    readonly status: DbtJobStatus;
    readonly error?: string;
    readonly result?: unknown;
    readonly createdAt: Date;
    readonly startedAt?: Date;
    readonly completedAt?: Date;
}