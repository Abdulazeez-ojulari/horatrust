import {
    Controller,
    Post,
    Body,
    UploadedFile,
    UseInterceptors,
    Req,
    Param,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { UploadProjectDto } from './dto/upload-project.dto';
import { UploadProjectUseCase } from './use-cases/upload-project.use-case';
import { UploadProjectVersionUseCase } from './use-cases/upload-project-version.use-case';

@Controller('projects')
export class ProjectController {

    constructor(
        private readonly uploadProject: UploadProjectUseCase,
        private readonly uploadProjectVersion: UploadProjectVersionUseCase,
    ) {}

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file'),
    )
    async upload(
        @Req() request: any,
        @Body() 
        dto: UploadProjectDto,
        @UploadedFile() 
        file: Express.Multer.File,
    ) {

        /*
         * tenantId should come from the
         * authenticated user/session.
         */

        const tenantId = request.user.tenantId;

        return this.uploadProject.execute(
            tenantId,
            dto.projectName,
            file,
        );
    }

    @Post(':projectId/versions')
    @UseInterceptors(
        FileInterceptor('file'),
    )
    async uploadVersion(
        @Req() request: any,

        @Param('projectId')
        projectId: string,

        @UploadedFile()
        file: Express.Multer.File,
    ) {

        return this.uploadProjectVersion.execute(
            request.user.tenantId,
            projectId,
            file,
        );
    }
}