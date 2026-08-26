import {
    Controller,
    Param,
    Post,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
    Get,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { DbtJobService } from '../services/dbt-job.service';
import { DbtProjectValidationWorkflowService } from '../services/dbt-project-validation-workflow.service';

@Controller('tenants/:tenantId/projects')
export class DbtProjectController {

    constructor(
        private readonly workflow: DbtProjectValidationWorkflowService,
        private readonly jobs: DbtJobService,
    ) {}

    @Post(':projectId/dbt/upload')
    @UseInterceptors(
        FileInterceptor('file')
    )
    async upload(
        @Param('tenantId')
        tenantId: string,

        @Param('projectId')
        projectId: string,

        @UploadedFile()
        file: Express.Multer.File,
    ) {

        if (!file) {
            throw new BadRequestException(
                'DBT project ZIP file is required.',
            );
        }

        return this.workflow.execute(
            tenantId,
            projectId,
            file.buffer,
            file.originalname,
        );
    }

    @Get(':projectId/dbt/jobs/:jobId')
    async getJob(
        @Param('jobId')
        jobId: string,
    ) {
        return this.jobs.getJob(
            jobId,
        );
    }
}