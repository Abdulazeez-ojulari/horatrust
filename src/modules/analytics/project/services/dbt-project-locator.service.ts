import { Injectable, BadRequestException } from '@nestjs/common';
import { readdir } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class DbtProjectLocatorService {

    async locate(
        rootPath: string,
    ): Promise<string> {

        const projectFile = await this.findFile(rootPath, 'dbt_project.yml' );

        if (!projectFile) {
            throw new BadRequestException(
                'The uploaded archive does not contain dbt_project.yml.',
            );
        }

        return projectFile;
    }

    private async findFile(
        directory: string,
        filename: string,
    ): Promise<string | null> {

        const entries =
            await readdir(
                directory,
                {
                    withFileTypes: true,
                },
            );

        for (const entry of entries) {
            const path = join(directory, entry.name);

            if (
                entry.isFile() &&
                entry.name === filename
            ) {
                return path;
            }

            if (entry.isDirectory()) {
                const result = await this.findFile(path, filename);

                if (result) {
                    return result;
                }
            }
        }

        return null;
    }
}