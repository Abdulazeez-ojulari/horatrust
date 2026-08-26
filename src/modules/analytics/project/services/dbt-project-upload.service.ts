import { Inject, Injectable } from '@nestjs/common';
import { ProjectWorkspaceService } from './project-workspace.service';
import { ProjectExtractionService } from './project-extraction.service';
import { DbtProjectLocatorService } from './dbt-project-locator.service';
import { ProjectStorage } from '../contracts/project-storage';

@Injectable()
export class DbtProjectUploadService {

    constructor(
        @Inject('ProjectStorage')
        private readonly storage: ProjectStorage,
        private readonly workspaceService: ProjectWorkspaceService,
        private readonly extractionService: ProjectExtractionService,
        private readonly locatorService: DbtProjectLocatorService,
    ) {}

    async prepare(
        tenantId: string,
        projectId: string,
        file: Buffer,
        originalName: string,
    ) {

        const stored =
            await this.storage.upload(
                tenantId,
                projectId,
                file,
                originalName,
            );

        const workspace =
            await this.workspaceService.create(
                projectId,
            );

        try {
            await this.extractionService.extract(file, workspace );
            const dbtProjectPath = await this.locatorService.locate(workspace.path);

            return {
                stored,
                workspace: {
                    ...workspace,
                    dbtProjectPath,
                },
            };

        } catch (error) {
            await this.workspaceService.cleanup(
                workspace,
            );

            throw error;
        }
    }

    async prepareStoredProject(
        projectId: string,
        archive: Buffer,
        originalName: string,
    ) {

        const workspace = await this.workspaceService.create(projectId);

        try {

            await this.extractionService.extract(
                archive,
                workspace,
            );

            const dbtProjectPath = await this.locatorService.locate(workspace.path);

            return {
                workspace: {
                    ...workspace,
                    dbtProjectPath,
                },
            };

        } catch (error) {
            await this.workspaceService.cleanup(workspace);

            throw error;
        }
    }

    async prepareProject(
    tenantId: string,
    projectId: string,
    version: number,
    cloudinaryPublicId: string,
) {

    const workspace =
        await this.workspace.create(
            tenantId,
            projectId,
            version,
        );

    try {

        const archive =
            await this.storage.downloadProject(
                cloudinaryPublicId,
            );

        await this.archive.extract(
            archive,
            workspace,
        );

        return workspace;

    } catch (error) {

        await this.workspace.cleanup(
            workspace,
        );

        throw error;
    }
}
}