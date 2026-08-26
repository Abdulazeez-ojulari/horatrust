import { Injectable } from '@nestjs/common';
import { CanonicalSemanticModel } from '../contracts/canonical';
import { DeepReadonly } from '../contracts/deep-readonly.type';
import { deepFreeze } from '../common/deep-freeze.util';

@Injectable()
export class SemanticModelCache {
    private model: DeepReadonly<CanonicalSemanticModel> | undefined;
    private loadedAt: Date | undefined;

    set(
        model: CanonicalSemanticModel,
    ): DeepReadonly<CanonicalSemanticModel> {

        const immutableModel = deepFreeze(model);

        this.model = immutableModel;
        this.loadedAt = new Date();

        return immutableModel;
    }

    get():
        DeepReadonly<CanonicalSemanticModel> |
        undefined {

        return this.model;
    }

    has(): boolean {
        return this.model !== undefined;
    }

    getLoadedAt(): Date | undefined {
        return this.loadedAt;
    }

    clear(): void {
        this.model = undefined;
        this.loadedAt = undefined;
    }
}