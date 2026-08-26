import { Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class DbtArtifactPathService {

    manifestPath(
        projectDirectory: string,
    ): string {
        return join(
            projectDirectory,
            'target',
            'manifest.json'
        );
    }

    catalogPath(
        projectDirectory: string,
    ): string {
        return join(
            projectDirectory,
            'target',
            'catalog.json'
        );
    }
}