import { Injectable } from '@nestjs/common';
import fg from 'fast-glob';
import * as path from 'path';

@Injectable()
export class DbtProjectDiscoveryService {
    /**
     * Discover all YAML files that may contain dbt semantic metadata.
     */
    async discover(projectRoot: string): Promise<string[]> {
        const files = await fg(
            ['**/*.yml', '**/*.yaml'],
            {
                cwd: projectRoot,
                absolute: true,
                onlyFiles: true,
                followSymbolicLinks: true,
                ignore: [
                    '**/target/**',
                    '**/dbt_packages/**',
                    '**/.git/**',
                    '**/logs/**',
                    '**/node_modules/**',
                ],
            },
        );

        return files.sort((a: string, b: any) => a.localeCompare(b));
    }

    /**
     * Locate the dbt project file.
     */
    async findProjectFile(
        projectRoot: string,
    ): Promise<string | undefined> {
        const files = await fg(
            ['dbt_project.yml', 'dbt_project.yaml'],
            {
                cwd: projectRoot,
                absolute: true,
                onlyFiles: true,
            },
        );

        return files.length > 0 ? files[0] : undefined;
    }

    /**
     * Returns true if the supplied folder appears to be
     * a valid dbt project.
     */
    async isDbtProject(
        projectRoot: string,
    ): Promise<boolean> {
        const project = await this.findProjectFile(projectRoot);

        return project !== undefined;
    }
}