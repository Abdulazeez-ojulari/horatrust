import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ProjectRepository {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async findById(
        tenantId: string,
        projectId: string,
    ) {

        return this.prisma.project.findFirst({
            where: {
                id: projectId,
                tenantId,
            },
        });
    }

    async create(
        tenantId: string,
        name: string,
    ) {

        return this.prisma.project.create({
            data: {
                tenantId,
                name,
                status: 'UPLOADED',
            },
        });
    }

    async updateStatus(
        tenantId: string,
        projectId: string,
        status:
            | 'UPLOADED'
            | 'VALIDATING'
            | 'VALID'
            | 'FAILED',
    ) {

        return this.prisma.project.updateMany({
            where: {
                id: projectId,
                tenantId,
            },

            data: {
                status,
            },
        });
    }

    async setActiveVersion(
        tenantId: string,
        projectId: string,
        versionId: string,
    ) {

        return this.prisma.project.updateMany({
            where: {
                id: projectId,
                tenantId,
            },
            data: {
                activeVersionId: versionId,
                status: 'VALID',
            },
        });
    }
}