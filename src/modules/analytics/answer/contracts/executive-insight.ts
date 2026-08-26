export type ExecutiveInsightType =
    | 'summary'
    | 'trend'
    | 'comparison'
    | 'anomaly'
    | 'breakdown';

export interface ExecutiveInsight {
    readonly type: ExecutiveInsightType;
    readonly title: string;
    readonly description: string;
    readonly value?: number;
    readonly previousValue?: number;
    readonly absoluteChange?: number;
    readonly percentageChange?: number;
    readonly direction?: 'increase' | 'decrease' | 'unchanged';
}