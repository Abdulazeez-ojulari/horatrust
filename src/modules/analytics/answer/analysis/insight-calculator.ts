import { Injectable } from '@nestjs/common';

export interface NumericComparison {
    readonly current: number;
    readonly previous: number;
    readonly absoluteChange: number;
    readonly percentageChange?: number;
    readonly direction:
        | 'increase'
        | 'decrease'
        | 'unchanged';
}

@Injectable()
export class InsightCalculator {

    compare(
        current: number,
        previous: number,
    ): NumericComparison {

        const absoluteChange = current - previous;
        const percentageChange = previous !== 0 ? (absoluteChange / Math.abs(previous)) * 100 : undefined;
        const direction =
            absoluteChange > 0
                ? 'increase'
                : absoluteChange < 0 ? 'decrease' : 'unchanged';

        return {
            current,
            previous,
            absoluteChange,
            percentageChange,
            direction,
        };
    }
}