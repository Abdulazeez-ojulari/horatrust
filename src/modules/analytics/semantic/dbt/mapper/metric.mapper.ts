import { Injectable } from '@nestjs/common';
import { DbtMetricDto } from '../dto';
import { CanonicalMetric } from '../../contracts/canonical/canonical-metric';

@Injectable()
export class MetricMapper {

    map(
        metric: DbtMetricDto,
    ): CanonicalMetric {

        return {
            name: metric.name,
            label: metric.label,
            description: metric.description,
            type: metric.type,
            typeParams: {
                ...metric.type_params,
            },
            filter: metric.filter,
            metadata: metric.meta,
            config: metric.config,
        };

    }

    mapMany(
        metrics: DbtMetricDto[],
    ): CanonicalMetric[] {

        return metrics.map(
            metric => this.map(metric),
        );

    }

}