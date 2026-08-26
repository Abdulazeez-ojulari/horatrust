import { Injectable } from '@nestjs/common';
import { SemanticQuery } from '../../query/contracts/semantic-query';
import { MetricFlowQueryRequest } from './metricflow.types';

@Injectable()
export class MetricFlowQueryMapper {

    map(
        query: SemanticQuery,
    ): MetricFlowQueryRequest {

        return {
            metrics: query.metrics,
            groupBy: query.dimensions,
            where: query.filters?.map(filter => this.mapFilter(filter)),
            orderBy: query.orderBy?.map(order => `${order.field} ${order.direction}`),
            limit: query.limit,
            offset: query.offset,
        };
    }

    private mapFilter(
        filter: NonNullable<SemanticQuery['filters']>[number],
    ): string {

        if (
            filter.operator === 'is_null'
        ) {
            return `${filter.field} IS NULL`;
        }

        if (
            filter.operator === 'is_not_null'
        ) {
            return `${filter.field} IS NOT NULL`;
        }

        if (
            filter.operator === 'in' ||
            filter.operator === 'not_in'
        ) {

            const values =
                Array.isArray(filter.value)
                    ? filter.value
                    : [filter.value];

            const formatted =
                values
                    .map((value: any) => this.formatValue(value))
                    .join(', ');

            const operator = filter.operator === 'in' ? 'IN' : 'NOT IN';

            return `${filter.field} ${operator} (${formatted})`;
        }

        const operator = this.mapOperator( filter.operator );

        return `${filter.field} ${operator} ${
            this.formatValue(filter.value)
        }`;
    }

    private mapOperator(
        operator: NonNullable<
            SemanticQuery['filters']
        >[number]['operator'],
    ): string {

        switch (operator) {

            case 'eq':
                return '=';

            case 'neq':
                return '!=';

            case 'gt':
                return '>';

            case 'gte':
                return '>=';

            case 'lt':
                return '<';

            case 'lte':
                return '<=';

            case 'contains':
                return 'LIKE';

            case 'starts_with':
                return 'LIKE';

            case 'ends_with':
                return 'LIKE';

            default:
                throw new Error(
                    `Unsupported filter operator: ${operator}`,
                );
        }
    }

    private formatValue(
        value: unknown,
    ): string {

        if (value === null) {
            return 'NULL';
        }

        if (typeof value === 'number') {
            return String(value);
        }

        if (typeof value === 'boolean') {
            return value
                ? 'TRUE'
                : 'FALSE';
        }

        const stringValue = String(value).replace(/'/g, "''");

        return `'${stringValue}'`;
    }
}