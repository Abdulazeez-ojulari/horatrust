import { AnalyticsProject } from './analytics-project';
import { AnalyticsProjectSource } from './project-source';

export interface ProjectIngestionContext {
    readonly project: AnalyticsProject;
    readonly source: AnalyticsProjectSource;
    readonly projectDirectory: string;
    readonly dbtProjectFile: string;
    readonly yamlFiles: readonly string[];
    readonly sqlFiles: readonly string[];
    readonly dataFiles: readonly string[];
}