import { Injectable } from '@nestjs/common';

import { DbtMeasureDto, DbtAggregationType } from '../dto';

import { CanonicalMeasure } from '../../contracts/canonical/canonical-measure';

@Injectable()
export class MeasureMapper {

    map(
        measure: DbtMeasureDto,
    ): CanonicalMeasure {

        return {
            name: measure.name,
            description: measure.description,
            expression: measure.expr,
            aggregation: this.mapAggregation(
                measure.agg,
            ),
            filter: measure.filter,
        };

    }

    mapMany(
        measures: DbtMeasureDto[],
    ): CanonicalMeasure[] {

        return measures.map(
            measure => this.map(measure),
        );

    }

    private mapAggregation(
        aggregation: DbtAggregationType,
    ): CanonicalMeasure['aggregation'] {

        switch (aggregation) {

            case DbtAggregationType.SUM:
                return 'sum';

            case DbtAggregationType.MIN:
                return 'min';

            case DbtAggregationType.MAX:
                return 'max';

            case DbtAggregationType.COUNT:
                return 'count';

            case DbtAggregationType.COUNT_DISTINCT:
                return 'count_distinct';

            case DbtAggregationType.AVERAGE:
                return 'average';

            case DbtAggregationType.MEDIAN:
                return 'median';

            case DbtAggregationType.PERCENTILE:
                return 'percentile';

            case DbtAggregationType.BOOLEAN:
                return 'boolean';

            default:
                return 'sum';

        }

    }

}