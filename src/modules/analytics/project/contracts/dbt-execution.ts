export type DbtCommand =
    | 'parse'
    | 'compile';

export interface DbtExecutionContext {
    readonly tenantId: string;
    readonly projectId: string;
    readonly projectDirectory: string;
    readonly dbtProjectPath: string;
    readonly profilesDirectory?: string;
}

export interface DbtExecutionResult {
    readonly command: DbtCommand;
    readonly success: boolean;
    readonly exitCode: number;
    readonly stdout: string;
    readonly stderr: string;
    readonly durationMs: number;
}

export interface DbtValidationResult {
    readonly success: boolean;
    readonly parse: DbtExecutionResult;
    readonly compile?: DbtExecutionResult;
    readonly error?: string;
}