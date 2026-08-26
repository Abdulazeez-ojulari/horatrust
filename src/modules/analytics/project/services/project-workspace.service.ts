import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { mkdtemp, rm } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { ProjectWorkspace } from '../contracts/project-workspace';

@Injectable()
export class ProjectWorkspaceService {

    async create(
        projectId: string,
    ): Promise<ProjectWorkspace> {

        try {

            const path = await mkdtemp(join(tmpdir(), `analytics-${projectId}-`));

            return {
                projectId,
                path,
                dbtProjectPath: join(path, 'dbt_project.yml'),
            };

        } catch (error) {
            throw new InternalServerErrorException(
                error instanceof Error
                    ? error.message
                    : 'Unable to create project workspace.',
            );
        }
    }

    async cleanup(
        workspace: ProjectWorkspace,
    ): Promise<void> {

        await rm(
            workspace.path,
            {
                recursive: true,
                force: true,
            },
        );
    }
}