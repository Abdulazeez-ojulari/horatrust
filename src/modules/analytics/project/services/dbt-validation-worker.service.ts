import { Injectable, Logger } from '@nestjs/common';
import { DbtJobRepository } from './dbt-job.repository';
import { DbtProjectUploadService } from './dbt-project-upload.service';
import { DbtValidationService } from './dbt-validation.service';
import { ProjectWorkspaceService } from './project-workspace.service';
import { Inject } from '@nestjs/common';
import { ProjectStorage } from '../contracts/project-storage';
import { DbtJobStatus } from '../contracts/dbt-job';
import { DbtSemanticModelBuilderService } from './dbt-semantic-model-builder.service';

@Injectable()
export class DbtValidationWorkerService {

    private readonly logger = new Logger(DbtValidationWorkerService.name);

    constructor(
        private readonly jobs: DbtJobRepository,
        private readonly uploadService: DbtProjectUploadService,
        private readonly validationService: DbtValidationService,
        private readonly workspaceService: ProjectWorkspaceService,
        private readonly semanticModelBuilder: DbtSemanticModelBuilderService,

        @Inject('ProjectStorage')
        private readonly storage: ProjectStorage,
    ) {}

    async process(
        jobId: string,
        tenantId: string,
        projectId: string,
        assetId: string,
    ): Promise<void> {

        this.jobs.update(
            jobId,
            {
                status: DbtJobStatus.RUNNING,
                startedAt: new Date(),
            },
        );

        let workspace;

        try {

            const archive = await this.storage.download(assetId);

            // const prepared =
            //     await this.uploadService.prepare(
            //         tenantId,
            //         projectId,
            //         archive,
            //         `${projectId}.zip`,
            //     );
            
            const prepared =
                await this.uploadService.prepareStoredProject(
                    projectId,
                    archive,
                    `${projectId}.zip`,
                );

            workspace = prepared.workspace;

            const result =
                await this.validationService.validate({
                    tenantId,
                    projectId,
                    projectDirectory: workspace.path,
                    dbtProjectPath: workspace.dbtProjectPath,
                });

            if (!result.success) {
                this.jobs.update(
                    jobId,
                    {
                        status: DbtJobStatus.FAILED,
                        error: result.error,
                        result,
                        completedAt: new Date(),
                    },
                );

                return;
            }

            const semanticModel =
                await this.semanticModelBuilder.build(
                    tenantId,
                    projectId,
                    workspace.path,
                );


            this.jobs.update(
                jobId,
                {
                    status: DbtJobStatus.SUCCESS,
                    result: {
                        dbt: result,
                        semanticModel,
                    },
                    completedAt: new Date(),
                },
            );

        } catch (error) {

            this.logger.error(
                `DBT job ${jobId} failed`,
                error,
            );

            this.jobs.update(
                jobId,
                {
                    status: DbtJobStatus.FAILED,
                    error: error instanceof Error ? error.message : 'DBT job failed.',
                    completedAt: new Date(),
                },
            );

        } finally {

            if (workspace) {
                await this.workspaceService.cleanup(workspace);
            }
        }
    }
}