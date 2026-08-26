import { Injectable } from '@nestjs/common';
import { SemanticQueryResult } from '../../query/contracts/semantic-query-result';
import { MetricFlowQueryResponse } from './metricflow.types';

@Injectable()
export class MetricFlowResultMapper {

    map(
        response: MetricFlowQueryResponse,
    ): SemanticQueryResult {

        const columns = response.columns.map(name => ({ name }));

        const rows =
            response.data.map(
                values =>
                    Object.fromEntries(
                        response.columns.map(
                            (column, index) => [ column, values[index] ],
                        ),
                    ),
            );

        return {
            columns,
            rows,
            rowCount: response.rowCount ?? rows.length,
        };
    }
}