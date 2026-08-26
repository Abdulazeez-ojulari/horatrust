import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { spawn } from 'child_process';

export interface DbtCommandResult {
    readonly command: string;
    readonly args: string[];
    readonly exitCode: number;
    readonly stdout: string;
    readonly stderr: string;
    readonly success: boolean;
    readonly durationMs: number;
}

@Injectable()
export class DbtCommandService {
    async run(
        projectDirectory: string,
        args: string[],
    ): Promise<DbtCommandResult> {

        const startedAt = Date.now();

        return new Promise(
            (resolve, reject) => {

                const child =
                    spawn(
                        'dbt',
                        args,
                        {
                            cwd: projectDirectory,
                            env: {
                                ...process.env,
                                DBT_PROJECT_DIR: projectDirectory,
                            },
                            shell: false,
                        },
                    );

                let stdout = '';
                let stderr = '';

                child.stdout.on(
                    'data',
                    (
                        data: Buffer,
                    ) => {
                        stdout += data.toString();
                    },
                );

                child.stderr.on(
                    'data',
                    (
                        data: Buffer,
                    ) => {
                        stderr += data.toString();
                    },
                );

                child.on(
                    'error',
                    (
                        error,
                    ) => {

                        reject(
                            new InternalServerErrorException(
                                `Unable to execute dbt: ${error.message}`,
                            ),
                        );
                    },
                );

                child.on(
                    'close',
                    (
                        exitCode,
                    ) => {

                        resolve({
                            command: 'dbt',
                            args,
                            exitCode: exitCode ?? -1,
                            stdout,
                            stderr,
                            success: exitCode === 0,
                            durationMs: Date.now() - startedAt,
                        });
                    },
                );
            },
        );
    }
}