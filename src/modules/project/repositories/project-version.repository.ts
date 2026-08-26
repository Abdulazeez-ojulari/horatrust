import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ProjectVersionRepository {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async getLatestVersion(
        tenantId: string,
        projectId: string,
    ) {

        return this.prisma.projectVersion.findFirst({
            where: {
                tenantId,
                projectId,
            },

            orderBy: {
                version: 'desc',
            },
        });
    }

    async create(
        data: {
            tenantId: string;
            projectId: string;
            version: number;
            cloudinaryPublicId: string;
            cloudinaryUrl: string;
            cloudinaryResourceType?: string;
        },
    ) {

        return this.prisma.projectVersion.create({
            data: {
                tenantId: data.tenantId,
                projectId: data.projectId,
                version: data.version,
                cloudinaryPublicId: data.cloudinaryPublicId,
                cloudinaryUrl: data.cloudinaryUrl,
                cloudinaryResourceType: data.cloudinaryResourceType,
                status: 'UPLOADED',
            },
        });
    }

    async updateStatus(
        tenantId: string,
        versionId: string,
        status:
            | 'UPLOADED'
            | 'VALIDATING'
            | 'VALID'
            | 'FAILED',
        validationError?: string,
    ) {

        return this.prisma.projectVersion.updateMany({
            where: {
                id: versionId,
                tenantId,
            },
            data: {
                status,
                validationError,
            },
        });
    }

    async saveCanonicalModel(
        tenantId: string,
        versionId: string,
        canonicalModel: unknown,
    ) {

        return this.prisma.projectVersion.updateMany({
            where: {
                id: versionId,
                tenantId,
            },

            data: {
                canonicalSemanticModel: canonicalModel as any,
                status: 'VALID',
            },
        });
    }

    async findById(
        tenantId: string,
        projectId: string,
        versionId: string,
    ) {

        return this.prisma.projectVersion.findFirst({
            where: {
                id: versionId,
                tenantId,
                projectId,
            },
        });
    }
}