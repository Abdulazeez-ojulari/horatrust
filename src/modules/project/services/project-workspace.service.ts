import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { mkdir, rm } from 'fs/promises';
import { join } from 'path';
import AdmZip from 'adm-zip';

@Injectable()
export class ProjectWorkspaceService {

    private readonly root =
        process.env.DBT_WORKSPACE_ROOT ??
        '/tmp/dbt';

    async create(
        tenantId: string,
        projectId: string,
        version: number,
    ): Promise<string> {

        const directory =
            join(
                this.root, tenantId, projectId, `v${version}`,
            );

        await mkdir(
            directory,
            {
                recursive: true,
            },
        );

        return directory;
    }

    async cleanup(
        directory: string,
    ): Promise<void> {

        await rm(
            directory,
            {
                recursive: true,
                force: true,
            },
        );
    }

    async extract(
        archive: Buffer,
        workspace: string,
    ): Promise<void> {

        await mkdir(
            workspace,
            {
                recursive: true,
            },
        );

        const zip =
            new AdmZip(
                archive,
            );

        zip.extractAllTo(
            workspace,
            true,
        );
    }

    getWorkspacePath(
        tenantId: string,
        projectId: string,
    ): string {

        return join(
            this.root,
            this.safeSegment(tenantId),
            this.safeSegment(projectId),
        );
    }

    private safeSegment(
        value: string,
    ): string {

        if (
            !/^[a-zA-Z0-9_-]+$/.test(value)
        ) {
            throw new InternalServerErrorException(
                'Invalid workspace identifier.',
            );
        }

        return value;
    }
}

// import {
//     Injectable,
//     InternalServerErrorException,
// } from '@nestjs/common';

// import {
//     mkdir,
//     rm,
// } from 'fs/promises';

// import {
//     join,
// } from 'path';

// @Injectable()
// export class ProjectWorkspaceService {

//     private readonly rootDirectory =
//         process.env.DBT_WORKSPACE_ROOT ??
//         '/tmp/dbt-workspaces';

//     async createWorkspace(
//         tenantId: string,
//         projectId: string,
//     ): Promise<string> {

//         const workspace =
//             this.getWorkspacePath(
//                 tenantId,
//                 projectId,
//             );

//         await mkdir(
//             workspace,
//             {
//                 recursive: true,
//             },
//         );

//         return workspace;
//     }

//     async removeWorkspace(
//         tenantId: string,
//         projectId: string,
//     ): Promise<void> {

//         const workspace =
//             this.getWorkspacePath(
//                 tenantId,
//                 projectId,
//             );

//         await rm(
//             workspace,
//             {
//                 recursive: true,
//                 force: true,
//             },
//         );
//     }

//     getWorkspacePath(
//         tenantId: string,
//         projectId: string,
//     ): string {

//         return join(
//             this.rootDirectory,
//             this.safeSegment(tenantId),
//             this.safeSegment(projectId),
//         );
//     }

//     private safeSegment(
//         value: string,
//     ): string {

//         if (
//             !/^[a-zA-Z0-9_-]+$/.test(value)
//         ) {
//             throw new InternalServerErrorException(
//                 'Invalid workspace identifier.',
//             );
//         }

//         return value;
//     }
// }