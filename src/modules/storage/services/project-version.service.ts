import { Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from '../../storage/cloudinary/cloudinary.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ProjectVersionService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly storage: CloudinaryService,
    ) {}

    async createVersion(
        tenantId: string,
        projectId: string,
        file: Buffer,
    ) {

        const project =
            await this.prisma.project.findFirst({
                where: {
                    id: projectId,
                    tenantId,
                },
            });

        if (!project) {
            throw new NotFoundException(
                'Project not found.',
            );
        }

        const latest =
            await this.prisma.projectVersion.findFirst({
                where: {
                    projectId,
                    tenantId,
                },
                orderBy: {
                    version: 'desc',
                },
            });

        const version = (latest?.version ?? 0) + 1;

        const uploaded =
            await this.storage.uploadProject(
                file,
                tenantId,
                projectId,
                version,
            );

        return this.prisma.projectVersion.create({
            data: {
                projectId,
                tenantId,
                version,
                cloudinaryPublicId: uploaded.publicId,
                cloudinaryUrl: uploaded.secureUrl,
                cloudinaryResourceType: uploaded.resourceType,
                status: 'UPLOADED',
            },
        });
    }
}