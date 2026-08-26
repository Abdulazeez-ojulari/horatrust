import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { DbtManifest } from '../contracts/dbt-manifest';

@Injectable()
export class DbtArtifactReaderService {

    async readManifest(
        manifestPath: string,
    ): Promise<DbtManifest> {

        try {
            const content = await readFile(manifestPath, 'utf8');
            return JSON.parse(content) as DbtManifest;
        } catch (error) {
            throw new InternalServerErrorException(
                error instanceof Error
                    ? `Unable to read DBT manifest: ${error.message}`
                    : 'Unable to read DBT manifest.',
            );
        }
    }
}