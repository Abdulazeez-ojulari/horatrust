import { Injectable, BadRequestException } from '@nestjs/common';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import AdmZip from 'adm-zip';
import { ProjectWorkspace } from '../contracts/project-workspace';

@Injectable()
export class ProjectExtractionService {

    async extract(
        archive: Buffer,
        workspace: ProjectWorkspace,
    ): Promise<void> {

        const zip = new AdmZip(archive);

        const entries = zip.getEntries();

        if (entries.length === 0) {
            throw new BadRequestException(
                'The uploaded project archive is empty.'
            );
        }

        for (const entry of entries) {

            if (entry.isDirectory) {
                continue;
            }

            const entryName = this.safePath(entry.entryName);

            const target =
                join(
                    workspace.path,
                    entryName,
                );

            await writeFile(
                target,
                entry.getData(),
            );
        }
    }

    private safePath(
        entryName: string,
    ): string {

        const normalized =
            entryName
                .replace(/\\/g, '/')
                .replace(/^\/+/, '');

        if (
            normalized.includes('../') ||
            normalized === '..' ||
            normalized.includes('/..')
        ) {
            throw new BadRequestException(
                'Invalid project archive.',
            );
        }

        return normalized;
    }
}