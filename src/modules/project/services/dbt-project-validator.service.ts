import { Injectable } from '@nestjs/common';
import { DbtCommandService, DbtCommandResult } from './dbt-command.service';

@Injectable()
export class DbtProjectValidatorService {

    constructor(
        private readonly dbt: DbtCommandService,
    ) {}

    async validate(
        projectDirectory: string,
    ): Promise<DbtCommandResult[]> {

        const results: DbtCommandResult[] = [];

        results.push(
            await this.dbt.run(
                projectDirectory,
                [ 'parse', '--no-write-json' ],
            ),
        );

        if (
            !results[
                results.length - 1
            ].success
        ) {
            return results;
        }

        results.push(
            await this.dbt.run(
                projectDirectory,
                [ 'compile' ]
            ),
        );

        if (
            !results[ results.length - 1 ].success
        ) {
            return results;
        }

        results.push(
            await this.dbt.run(
                projectDirectory,
                [ 'test' ]
            ),
        );

        return results;
    }

    async generateArtifacts(
        projectDirectory: string,
    ): Promise<DbtCommandResult> {

        return this.dbt.run(
            projectDirectory,
            [ 'docs', 'generate' ]
        );
    }
}