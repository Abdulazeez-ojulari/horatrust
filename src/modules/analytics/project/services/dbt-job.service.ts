import { Injectable, NotFoundException } from '@nestjs/common';
import { DbtJobRepository } from './dbt-job.repository';
import { DbtValidationWorkerService } from './dbt-validation-worker.service';

@Injectable()
export class DbtJobService {

    constructor(
        private readonly jobs: DbtJobRepository,
        private readonly worker: DbtValidationWorkerService,
    ) {}

    async createValidationJob(
        tenantId: string,
        projectId: string,
        assetId: string,
    ) {

        const job =
            this.jobs.create(
                tenantId,
                projectId,
            );

        setImmediate(
            () => {
                void this.worker.process(
                    job.id,
                    tenantId,
                    projectId,
                    assetId,
                );
            },
        );

        return job;
    }

    getJob(
        jobId: string,
    ) {
        const job = this.jobs.findById(jobId);
        if (!job) {
            throw new NotFoundException(
                `Job '${jobId}' not found.`,
            );
        }
        return job;
    }
}