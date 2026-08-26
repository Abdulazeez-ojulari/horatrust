export type ProjectFileType =
    | 'dbt_project'
    | 'yaml'
    | 'sql'
    | 'csv'
    | 'json'
    | 'other';

export interface AnalyticsProjectFile {
    readonly id: string;
    readonly projectId: string;
    readonly sourceId: string;
    readonly name: string;
    readonly path: string;
    readonly type: ProjectFileType;
    readonly size: number;
    readonly createdAt: Date;
}