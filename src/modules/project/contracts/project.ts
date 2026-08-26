export type ProjectStatus =
    | 'UPLOADED'
    | 'VALIDATING'
    | 'VALID'
    | 'FAILED';

export interface Project {
    readonly id: string;
    readonly tenantId: string;
    readonly name: string;
    readonly dbtProjectPath: string;
    readonly status: ProjectStatus;
    readonly lastValidationError?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}