import { Injectable } from '@nestjs/common';
import { CanonicalSemanticModel } from '../../contracts/canonical';
import { DeepReadonly } from '../../contracts/deep-readonly.type';
import { SemanticProvider, SemanticProviderType } from '../../contracts';
import { DbtSemanticLoaderService } from '../loader/dbt-semantic-loader.service';
import { SemanticQueryEngine } from '../../query/contracts';
import { DbtSemanticQueryEngine } from '../metricflow';

@Injectable()
export class DbtSemanticProvider implements SemanticProvider {

    readonly type = SemanticProviderType.DBT;

    constructor(
        private readonly loader: DbtSemanticLoaderService,
        private readonly queryEngine: DbtSemanticQueryEngine,
    ) {}

    async load(
        source: string,
    ): Promise<
        DeepReadonly<CanonicalSemanticModel>
    > {
        return this.loader.load(source);
    }

    getModel():
        DeepReadonly<CanonicalSemanticModel> |
        undefined {
        return this.loader.get();
    }

    getQueryEngine(): SemanticQueryEngine {
        return this.queryEngine;
    }

    isLoaded(): boolean {
        return this.loader.has();
    }

    clear(): void {
        this.loader.clear();
    }

}