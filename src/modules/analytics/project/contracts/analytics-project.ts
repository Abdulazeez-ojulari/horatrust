export type SemanticProviderType =
    | 'dbt';

export interface AnalyticsProject {
    readonly id: string;
    readonly tenantId: string;
    readonly name: string;
    readonly semanticProvider: SemanticProviderType;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}