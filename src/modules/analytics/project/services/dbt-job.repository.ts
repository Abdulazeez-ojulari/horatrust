import { Injectable } from '@nestjs/common';
import { DbtJobStatus, DbtValidationJob } from '../contracts/dbt-job';

@Injectable()
export class DbtJobRepository {

    private readonly jobs = new Map<string, DbtValidationJob>();

    create(
        tenantId: string,
        projectId: string,
    ): DbtValidationJob {

        const id = crypto.randomUUID();
        const job: DbtValidationJob = {
            id,
            tenantId,
            projectId,
            status: DbtJobStatus.QUEUED,
            createdAt: new Date(),
        };
        this.jobs.set(id, job);
        return job;
    }

    findById(
        id: string,
    ): DbtValidationJob | undefined {
        return this.jobs.get(id);
    }

    update(
        id: string,
        update: Partial<DbtValidationJob>,
    ): DbtValidationJob {

        const existing = this.jobs.get(id);
        if (!existing) {
            throw new Error(
                `DBT job '${id}' not found.`,
            );
        }
        const updated: DbtValidationJob = {
            ...existing,
            ...update,
        };
        this.jobs.set(id, updated);
        return updated;
    }
}