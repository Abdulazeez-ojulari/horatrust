import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import { MetricFlowConfig } from './metricflow.config';
import { MetricFlowQueryRequest, MetricFlowQueryResponse } from './metricflow.types';

const execFileAsync = promisify(execFile);

import {
    parse,
} from 'csv-parse/sync';
import * as fs from 'fs';

@Injectable()
export class MetricFlowClient {

    constructor(
        private readonly config: MetricFlowConfig,
    ) {}

    async query(
        request: MetricFlowQueryRequest,
    ): Promise<MetricFlowQueryResponse> {

        const args = this.buildArguments(request);

        try {

            const {
                stdout,
                stderr
            } = await this.runMetricFlow(this.config.executable, args, this.config.projectDirectory || undefined)

            // const {
            //     stdout,
            //     stderr
            // } = await execFileAsync(
            //     this.config.executable,
            //     [...args, '--no-color'],
            //     {
            //         cwd: this.config.projectDirectory || undefined,
            //         timeout: Math.floor(120000),
            //         maxBuffer: 10 * 1024 * 1024,
            //         env: {
            //             ...process.env,
            //             NO_COLOR: '1',     // Tells colorama/chalk-like libraries to suppress ANSI
            //             TERM: 'dumb',      // Signals a non-interactive terminal to Python wrappers
            //             PYTHONIOENCODING: 'utf-8' // Forces standard text streaming instead of binary
            //         },
            //     },
            // );

            if (!stdout && stderr) {
                throw new Error(stderr);
            }

            const fileContent = fs.readFileSync('data.csv', 'utf-8');

            console.log(stdout, "sg34")
            console.log(fileContent)

            return this.parseResponse(
                fileContent,
            );

        } catch (error) {

            console.log(error)

            const message =
                error instanceof Error
                    ? error.message
                    : 'Unknown MetricFlow error';

            throw new InternalServerErrorException(
                `MetricFlow execution failed: ${message}`,
            );
        }
    }

    runMetricFlow (executable: string, args: string[], cwd: string | undefined): Promise<{
        stdout: string;
        stderr: string;
    }> {
        return new Promise((resolve, reject) => {
            const child = spawn(executable, args, {
                cwd: cwd,
                env: {
                    ...process.env,
                    TERM: 'xterm-256color',       // Pretend it's a real terminal so halo/colorama initializes
                    FORCE_COLOR: '0',             // Disables color output safely without CLI flags
                    PYTHONUNBUFFERED: '1',  
                    PYTHONIOENCODING: 'utf-8',      // Prevents stream buffering issues in python subprocesses
                },
                shell: false,                      // Run via shell to properly map Windows/OS environment streams
            });

            let stdout = '';
            let stderr = '';

            child.stdout.on('data', (data) => { stdout += data.toString(); });
            child.stderr.on('data', (data) => { stderr += data.toString(); });

            child.on('close', (code) => {
                if (code === 0) resolve({ stdout, stderr });
                else reject(new Error(`MetricFlow failed with code ${code}: ${stderr}` ));
            });
        });
    };

    private buildArguments(
        request: MetricFlowQueryRequest,
    ): string[] {

        const args: string[] = [
            'query',
        ];

        if (request.metrics.length > 0) {
            args.push('--metrics', request.metrics.join(','));
        }

        if (
            request.groupBy &&
            request.groupBy.length > 0
        ) {
            args.push('--group-by', request.groupBy.join(','));
        }

        if (
            request.where &&
            request.where.length > 0
        ) {
            args.push('--where', request.where.join(','));
        }

        if (
            request.orderBy &&
            request.orderBy.length > 0
        ) {
            args.push('--order', request.orderBy.join(','));
        }

        if (request.limit !== undefined) {
            args.push('--limit', String(request.limit));
        }

        if (request.offset !== undefined) {
            args.push('--offset', String(request.offset));
        }

        args.push('--csv', 'data.csv');

        return args;
    }

    // private parseResponse(
    //     stdout: string,
    // ): MetricFlowQueryResponse {

    //     const parsed = JSON.parse(stdout);

    //     return {
    //         columns: parsed.columns ?? [],
    //         data: parsed.data ?? [],
    //         rowCount: parsed.rowCount ?? parsed.data?.length ?? 0,
    //     };
    // }

    private parseResponse(
        stdout: string,
    ): MetricFlowQueryResponse {

        const records: any =
            parse(stdout, {
                columns: true,
                skip_empty_lines: true,
                trim: true,
            });

        if (!records.length) {
            return {
                columns: [],
                data: [],
                rowCount: 0,
            };
        }

        const columns = Object.keys(records[0]);

        const data =
            records.map(
                (record: Record<string, unknown>) =>
                    columns.map(
                        column =>
                            this.parseValue(
                                record[column],
                            ),
                    ),
            );

        return {
            columns,
            data,
            rowCount: data.length,
        };
    }

    private parseValue(
        value: unknown,
    ): unknown {

        if (value === null || value === '') {
            return value;
        }

        if (typeof value !== 'string') {
            return value;
        }

        if (value === 'true') {
            return true;
        }

        if (value === 'false') {
            return false;
        }

        const number = Number(value);

        if (
            value.trim() !== '' &&
            !Number.isNaN(number)
        ) {
            return number;
        }

        return value;
    }
}