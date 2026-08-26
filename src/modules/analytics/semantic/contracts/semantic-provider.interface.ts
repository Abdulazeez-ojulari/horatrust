import { SemanticQueryEngine } from '../query/contracts';
import { CanonicalSemanticModel } from './canonical';
import { DeepReadonly } from './deep-readonly.type';
import { SemanticProviderType } from './semantic-provider.enum';

export interface SemanticProvider {

    readonly type: SemanticProviderType;

    load(
        source: string,
    ): Promise<
        DeepReadonly<CanonicalSemanticModel>
    >;

    getModel(): DeepReadonly<CanonicalSemanticModel> | undefined;

    getQueryEngine(): SemanticQueryEngine;

    isLoaded(): boolean;

    clear(): void;
}