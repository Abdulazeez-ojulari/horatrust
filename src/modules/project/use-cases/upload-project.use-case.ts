import { Injectable, BadRequestException } from '@nestjs/common';
import { ProjectRepository } from '../repositories/project.repository';
import { ProjectVersionRepository } from '../repositories/project-version.repository';
import { CloudinaryService } from '../../storage/cloudinary/cloudinary.service';

@Injectable()
export class UploadProjectUseCase {

    constructor(
        private readonly projects: ProjectRepository,
        private readonly versions: ProjectVersionRepository,
        private readonly cloudinary: CloudinaryService,
    ) {}

    async execute(
        tenantId: string,
        projectName: string,
        file: Express.Multer.File,
    ) {

        if (!file) {
            throw new BadRequestException(
                'Project ZIP file is required.',
            );
        }

        const project =
            await this.projects.create(
                tenantId,
                projectName,
            );

        const uploaded =
            await this.cloudinary.uploadProject(
                file.buffer,
                tenantId,
                project.id,
                1,
            );

        const version =
            await this.versions.create({
                tenantId,
                projectId: project.id,
                version: 1,
                cloudinaryPublicId: uploaded.publicId,
                cloudinaryUrl: uploaded.secureUrl,
                cloudinaryResourceType: uploaded.resourceType,
            });

        return {
            projectId: project.id,
            versionId: version.id,
            version: version.version,
            status: version.status,
            cloudinaryPublicId: version.cloudinaryPublicId,
        };
    }
}