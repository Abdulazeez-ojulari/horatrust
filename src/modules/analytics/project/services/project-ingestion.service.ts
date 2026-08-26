import { Injectable } from '@nestjs/common';
import { ProjectIngestionContext } from '../contracts/project-ingestion-context';

@Injectable()
export class ProjectIngestionService {

    async createContext(
        projectId: string,
        tenantId: string,
        projectDirectory: string,
    ): Promise<ProjectIngestionContext> {

        const dbtProjectFile = `${projectDirectory}/dbt_project.yml`;

        return {
            project: {
                id: projectId,
                tenantId,
                name: projectId,
                semanticProvider: 'dbt',
                createdAt: new Date(),
                updatedAt: new Date(),
            },

            source: {
                id: `${projectId}-source`,
                projectId,
                type: 'cloudinary',
                assetId: '',
                assetUrl: '',
                // rootPath: projectDirectory,
                // dbtProjectFile,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            projectDirectory,
            dbtProjectFile,
            yamlFiles: [],
            dataFiles: [],
            sqlFiles: []
        };
    }
}