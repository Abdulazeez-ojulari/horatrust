import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../repositories/project.repository';
import { ProjectVersionRepository } from '../repositories/project-version.repository';
import { ProjectWorkspaceService } from '../services/project-workspace.service';
import { DbtCommandService } from '../services/dbt-command.service';
import { CloudinaryService } from '../../storage/cloudinary/cloudinary.service';
import { DbtArtifactService } from '../services/dbt-artifact.service';

@Injectable()
export class ProcessProjectVersionUseCase {

    constructor(
        private readonly projects: ProjectRepository,
        private readonly versions: ProjectVersionRepository,
        private readonly workspace: ProjectWorkspaceService,
        private readonly cloudinary: CloudinaryService,
        private readonly dbt: DbtCommandService,
        private readonly artifacts: DbtArtifactService,
        private readonly adapter: DbtSemanticAdapterService,
    ) {}

    async execute(
        tenantId: string,
        projectId: string,
        versionId: string,
    ) {

        const version =
            await this.versions
                .findById(
                    tenantId,
                    projectId,
                    versionId,
                );

        if (!version) {
            throw new Error(
                'Project version not found.',
            );
        }

        await this.projects.updateStatus(
            tenantId,
            projectId,
            'VALIDATING',
        );

        await this.versions.updateStatus(
            tenantId,
            versionId,
            'VALIDATING',
        );

        const workspace =
            await this.workspace.create(
                tenantId,
                projectId,
                version.version,
            );

        try {

            const archive =
                await this.cloudinary
                    .downloadProject(
                        version.cloudinaryPublicId,
                    );

            await this.workspace.extract(
                archive,
                workspace
            );

            const parse =
                await this.dbt.run(
                    workspace,
                    [ 'parse' ]
                );

            if (!parse.success) {
                return this.fail(
                    tenantId,
                    projectId,
                    versionId,
                    parse.stderr ||
                    parse.stdout
                );
            }

            const compile =
                await this.dbt.run(
                    workspace,
                    [ 'compile' ]
                );

            if (!compile.success) {
                return this.fail(
                    tenantId,
                    projectId,
                    versionId,
                    compile.stderr ||
                    compile.stdout
                );
            }

            const test =
                await this.dbt.run(
                    workspace,
                    [ 'test' ]
                );

            if (!test.success) {

                return this.fail(
                    tenantId,
                    projectId,
                    versionId,
                    test.stderr ||
                    test.stdout
                );
            }

            const docs =
                await this.dbt.run(
                    workspace,
                    [ 'docs', 'generate' ]
                );

            if (!docs.success) {

                return this.fail(
                    tenantId,
                    projectId,
                    versionId,
                    docs.stderr ||
                    docs.stdout
                );
            }

            const manifest =
                await this.artifacts.readManifest(workspace);

            const canonicalModel =
                this.adapter.adapt(
                    manifest,
                    {
                        tenantId,
                        projectId,
                    },
                );

            await this.versions
                .saveCanonicalModel(
                    tenantId,
                    versionId,
                    canonicalModel,
                );

            await this.projects
                .setActiveVersion(
                    tenantId,
                    projectId,
                    versionId,
                );

            return {
                success: true,
                projectId,
                versionId,
                status: 'VALID',
                canonicalModel,
            };

        } finally {
            await this.workspace.cleanup(workspace);
        }
    }

    private async fail(
        tenantId: string,
        projectId: string,
        versionId: string,
        error: string,
    ) {

        await this.versions
            .updateStatus(
                tenantId,
                versionId,
                'FAILED',
                error,
            );

        await this.projects
            .updateStatus(
                tenantId,
                projectId,
                'FAILED',
            );

        return {
            success: false,
            projectId,
            versionId,
            status: 'FAILED',
            error,
        };
    }
}