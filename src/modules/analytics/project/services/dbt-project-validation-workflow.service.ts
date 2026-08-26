import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DbtJobService } from './dbt-job.service';
import { ProjectStorage } from '../contracts/project-storage';

@Injectable()
export class DbtProjectValidationWorkflowService {

    constructor(
        @Inject('ProjectStorage')
        private readonly storage: ProjectStorage,
        private readonly jobs: DbtJobService,
    ) {}

    async execute(
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

        return this.jobs.createValidationJob(
            tenantId,
            projectId,
            stored.assetId,
        );
    }
}