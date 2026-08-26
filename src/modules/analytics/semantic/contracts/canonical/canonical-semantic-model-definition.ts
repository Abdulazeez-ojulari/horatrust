import { CanonicalDefaults } from './canonical-defaults';
import { CanonicalDimension } from './canonical-dimension';
import { CanonicalEntity } from './canonical-entity';
import { CanonicalMeasure } from './canonical-measure';

export interface CanonicalSemanticModelDefinition {
    readonly name: string;
    readonly model: string;
    readonly description?: string;
    readonly defaults?: CanonicalDefaults;
    readonly entities: readonly CanonicalEntity[];
    readonly dimensions: readonly CanonicalDimension[];
    readonly measures: readonly CanonicalMeasure[];
}