import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProjectRepository } from '../repositories/project.repository';
import { ProjectVersionRepository } from '../repositories/project-version.repository';
import { CloudinaryService } from '../../storage/cloudinary/cloudinary.service';

@Injectable()
export class UploadProjectVersionUseCase {

    constructor(
        private readonly projects: ProjectRepository,
        private readonly versions: ProjectVersionRepository,
        private readonly cloudinary: CloudinaryService,
    ) {}

    async execute(
        tenantId: string,
        projectId: string,
        file: Express.Multer.File,
    ) {

        if (!file) {
            throw new BadRequestException(
                'Project ZIP file is required.',
            );
        }

        const project =
            await this.projects.findById(
                tenantId,
                projectId,
            );

        if (!project) {

            throw new NotFoundException(
                'Project not found.',
            );
        }

        const latest =
            await this.versions.getLatestVersion(
                    tenantId,
                    projectId,
                );

        const nextVersion = (latest?.version ?? 0) + 1;

        const uploaded =
            await this.cloudinary
                .uploadProject(
                    file.buffer,
                    tenantId,
                    projectId,
                    nextVersion,
                );

        const version =
            await this.versions.create({
                tenantId,
                projectId,
                version: nextVersion,
                cloudinaryPublicId: uploaded.publicId,
                cloudinaryUrl: uploaded.secureUrl,
                cloudinaryResourceType: uploaded.resourceType,
            });

        return {
            projectId,
            versionId: version.id,
            version: version.version,
            status: version.status,
        };
    }
}