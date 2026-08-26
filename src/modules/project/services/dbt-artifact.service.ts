import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { DbtManifest } from '../../analytics/project/contracts/dbt-manifest';

@Injectable()
export class DbtArtifactService {

    async readManifest(
        projectDirectory: string,
    ): Promise<DbtManifest> {

        const manifestPath =
            join(
                projectDirectory,
                'target',
                'manifest.json',
            );

        try {

            const content = await readFile(manifestPath, 'utf8');

            return JSON.parse(
                content,
            ) as DbtManifest;

        } catch (
            error
        ) {

            throw new InternalServerErrorException(
                `Unable to read DBT manifest: ${
                    error instanceof Error ? error.message : String(error)
                }`,
            );
        }
    }
}