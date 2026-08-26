import { CanonicalMetadata } from './canonical-metadata';
import { CanonicalMetric } from './canonical-metric';
import { CanonicalRelationship } from './canonical-relationship';
import { CanonicalSavedQuery } from './canonical-saved-query';
import { CanonicalSemanticModelDefinition } from './canonical-semantic-model-definition';

export interface CanonicalSemanticModel {
    readonly metadata?: CanonicalMetadata;
    readonly semanticModels: readonly CanonicalSemanticModelDefinition[];
    readonly metrics: readonly CanonicalMetric[];
    readonly savedQueries: readonly CanonicalSavedQuery[];
    readonly relationships: readonly CanonicalRelationship[];
}