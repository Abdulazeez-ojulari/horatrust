import { Injectable } from '@nestjs/common';
import { SemanticQuery, SemanticQueryResult } from '../../semantic/query/contracts';
import { ExecutiveInsight } from '../contracts';
import { InsightCalculator } from './insight-calculator';

@Injectable()
export class InsightAnalyzer {

    constructor(
        private readonly calculator: InsightCalculator,
    ) {}

    analyze(
        query: SemanticQuery,
        result: SemanticQueryResult,
    ): ExecutiveInsight[] {

        if (result.rowCount === 0) {
            return [
                {
                    type: 'summary',
                    title: 'No Data',
                    description: 'No data was returned for the requested query.',
                },
            ];
        }

        const insights: ExecutiveInsight[] = [];

        insights.push(
            ...this.analyzeMetrics(query, result)
        );

        if (
            this.hasTimeDimension(query, result)
        ) {
            insights.push(
                ...this.analyzeTimeSeries(query, result),
            );
        }

        return insights;
    }

    private analyzeMetrics(
        query: SemanticQuery,
        result: SemanticQueryResult,
    ): ExecutiveInsight[] {

        const insights: ExecutiveInsight[] = [];

        for (
            const metric of query.metrics
        ) {

            const column =
                result.columns.find(
                    column => column.name === metric,
                );

            if (!column) {
                continue;
            }

            const values =
                result.rows
                    .map(row => row[column.name])
                    .filter(
                        value => typeof value === 'number',
                    ) as number[];

            if (values.length === 0) {
                continue;
            }

            const latest = values[values.length - 1];

            insights.push({
                type: 'summary',
                title: this.formatTitle(metric),
                description:
                    `${this.formatTitle(metric)} is ` +
                    `${this.formatNumber(latest)}.`,
                value: latest,
            });
        }

        return insights;
    }

    private analyzeTimeSeries(
        query: SemanticQuery,
        result: SemanticQueryResult,
    ): ExecutiveInsight[] {

        const insights: ExecutiveInsight[] = [];
        const timeColumn = this.findTimeColumn(query, result);

        if (!timeColumn) {
            return insights;
        }

        for (
            const metric of query.metrics
        ) {

            const metricColumn = result.columns.find(column => column.name === metric);

            if (!metricColumn) {
                continue;
            }

            const observations =
                result.rows
                    .map(row => ({
                        period: row[timeColumn.name],
                        value: row[metricColumn.name],
                    }))
                    .filter(observation => typeof observation.value === 'number');

            if (observations.length < 2) {
                continue;
            }

            const previous = observations[observations.length - 2];
            const current = observations[observations.length - 1];
            const comparison =
                this.calculator.compare(
                    current.value as number,
                    previous.value as number,
                );

            const percentage =
                comparison.percentageChange !== undefined
                    ? ` (${this.formatPercentage(
                        comparison.percentageChange,
                    )})`
                    : '';

            insights.push({
                type: 'trend',
                title: `${this.formatTitle(metric)} Trend`,
                description:
                    `${this.formatTitle(metric)} ` +
                    `changed from ` +
                    `${this.formatNumber(
                        previous.value as number,
                    )} in ` +
                    `${String(previous.period)} ` +
                    `to ` +
                    `${this.formatNumber(
                        current.value as number,
                    )} in ` +
                    `${String(current.period)}` +
                    `${percentage}.`,
                value: current.value as number,
                previousValue: previous.value as number,
                absoluteChange: comparison.absoluteChange,
                percentageChange: comparison.percentageChange,
                direction: comparison.direction,
            });
        }

        return insights;
    }

    private hasTimeDimension(
        query: SemanticQuery,
        result: SemanticQueryResult,
    ): boolean {

        return Boolean(
            this.findTimeColumn(query, result),
        );
    }

    private findTimeColumn(
        query: SemanticQuery,
        result: SemanticQueryResult,
    ) {

        if (!query.timeRange) {
            return undefined;
        }

        const timeField = query.timeRange.dimension;

        return result.columns.find(
            column => column.name === timeField || column.name.includes(timeField)
        );
    }

    private formatTitle(
        value: string,
    ): string {

        return value
            .replace(/_/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
    }

    private formatNumber(
        value: number,
    ): string {

        return new Intl.NumberFormat(
            'en-US',
            {
                maximumFractionDigits: 2,
            },
        ).format(value);
    }

    private formatPercentage(
        value: number,
    ): string {
        return `${value.toFixed(2)}%`;
    }
}