import { Injectable } from '@nestjs/common';
import { DbtRunnerService } from './dbt-runner.service';
import { DbtExecutionContext, DbtValidationResult } from '../contracts/dbt-execution';

@Injectable()
export class DbtValidationService {

    constructor(
        private readonly dbtRunner: DbtRunnerService,
    ) {}

    async validate(
        context: DbtExecutionContext,
    ): Promise<DbtValidationResult> {

        const parse = await this.dbtRunner.run('parse', context);

        if (!parse.success) {

            return {
                success: false,
                parse,
                error: this.getErrorMessage(parse),
            };
        }

        const compile =
            await this.dbtRunner.run(
                'compile',
                context,
            );

        if (!compile.success) {
            return {
                success: false,
                parse,
                compile,
                error: this.getErrorMessage(compile),
            };
        }

        return {
            success: true,
            parse,
            compile,
        };
    }

    private getErrorMessage(
        result: {
            stdout: string;
            stderr: string;
        },
    ): string {

        if (result.stderr.trim()) {
            return result.stderr.trim();
        }

        if (result.stdout.trim()) {
            return result.stdout.trim();
        }

        return 'DBT validation failed.';
    }
}