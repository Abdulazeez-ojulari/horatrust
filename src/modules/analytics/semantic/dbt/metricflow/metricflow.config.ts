import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MetricFlowConfig {

    constructor(
        private readonly configService: ConfigService,
    ) {}

    get executable(): string {
        return this.configService.get<string>(
            'METRICFLOW_EXECUTABLE',
            'mf',
        );
    }

    get projectDirectory(): string {
        return this.configService.get<string>(
            'DBT_PROJECT_DIR',
            '',
        );
    }

    get timeoutMs(): number {
        return this.configService.get<number>(
            'METRICFLOW_TIMEOUT_MS',
            120000,
        );
    }
}