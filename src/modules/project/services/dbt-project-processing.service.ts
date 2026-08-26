import { Injectable } from '@nestjs/common';
import { DbtProjectValidatorService } from './dbt-project-validator.service';
import { DbtArtifactService } from './dbt-artifact.service';
import { DbtSemanticAdapterService } from '../../analytics/project/services/dbt-semantic-adapter.service';
import { ProjectWorkspaceService } from './project-workspace.service';

@Injectable()
export class DbtProjectProcessingService {

    constructor(
        private readonly validator: DbtProjectValidatorService,
        private readonly artifacts: DbtArtifactService,
        private readonly adapter: DbtSemanticAdapterService,
        private readonly workspace: ProjectWorkspaceService,
    ) {}

    async process(
        tenantId: string,
        projectId: string,
    ) {

        const projectDirectory =
            this.workspace.getWorkspacePath(
                tenantId,
                projectId,
            );

        const validation =
            await this.validator.validate(
                projectDirectory,
            );

        const failed = validation.find(result => !result.success);

        if (failed) {

            return {
                success: false,
                status: 'FAILED',
                error: failed.stderr || failed.stdout,
                steps: validation,
            };
        }

        const artifactResult = await this.validator.generateArtifacts(projectDirectory);

        if (
            !artifactResult.success
        ) {

            return {
                success: false,
                status: 'FAILED',
                error: artifactResult.stderr || artifactResult.stdout,

                steps: [ ...validation, artifactResult ],
            };
        }

        const manifest = await this.artifacts.readManifest(projectDirectory);

        const canonical =
            this.adapter.adapt(
                manifest,
                {
                    tenantId,
                    projectId,
                },
            );

        return {
            success: true,
            status: 'VALID',
            canonical,
            steps: [ ...validation, artifactResult ],
        };
    }
}