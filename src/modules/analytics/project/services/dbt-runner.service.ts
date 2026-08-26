import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { spawn } from 'child_process';
import { DbtCommand, DbtExecutionContext, DbtExecutionResult } from '../contracts/dbt-execution';

@Injectable()
export class DbtRunnerService {

    async run(
        command: DbtCommand,
        context: DbtExecutionContext,
    ): Promise<DbtExecutionResult> {

        const startedAt = Date.now();

        const args = [
            command,
            '--project-dir',
            context.projectDirectory,
        ];

        if (context.profilesDirectory) {
            args.push(
                '--profiles-dir',
                context.profilesDirectory,
            );
        }

        return new Promise(
            (resolve, reject) => {

                const child =
                    spawn(
                        'dbt',
                        args,
                        {
                            cwd: context.projectDirectory,
                            env: { ...process.env },
                            shell: false,
                        },
                    );

                let stdout = '';
                let stderr = '';

                child.stdout.on(
                    'data',
                    (data: Buffer) => {
                        stdout += data.toString();
                    },
                );

                child.stderr.on(
                    'data',
                    (data: Buffer) => {
                        stderr += data.toString();
                    },
                );

                child.on(
                    'error',
                    (error) => {

                        reject(
                            new InternalServerErrorException(
                                `Unable to execute dbt: ${error.message}`,
                            ),
                        );
                    },
                );

                child.on(
                    'close',
                    (exitCode) => {

                        resolve({
                            command,
                            success: exitCode === 0,
                            exitCode: exitCode ?? -1,
                            stdout,
                            stderr,
                            durationMs: Date.now() - startedAt,
                        });
                    },
                );
            },
        );
    }
}