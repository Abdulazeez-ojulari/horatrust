import { Module } from '@nestjs/common';
import { CloudinaryProjectStorage } from './storage/cloudinary-project-storage';
import { ProjectWorkspaceService } from './services/project-workspace.service';
import { ProjectExtractionService } from './services/project-extraction.service';
import { DbtProjectLocatorService } from './services/dbt-project-locator.service';
import { DbtProjectUploadService } from './services/dbt-project-upload.service';


@Module({
    providers: [
        CloudinaryProjectStorage,
        {
            provide: 'ProjectStorage',
            useExisting: CloudinaryProjectStorage,
        },
        ProjectWorkspaceService,
        ProjectExtractionService,
        DbtProjectLocatorService,
        DbtProjectUploadService,
    ],

    exports: [
        ProjectWorkspaceService,
        DbtProjectUploadService,

        {
            provide: 'ProjectStorage',
            useExisting: CloudinaryProjectStorage,
        },
    ],
})
export class AnalyticsProjectModule {}