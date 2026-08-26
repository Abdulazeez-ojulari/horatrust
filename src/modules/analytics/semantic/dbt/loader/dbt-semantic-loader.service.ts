import { Injectable, BadRequestException } from '@nestjs/common';
import { CanonicalSemanticModel } from '../../contracts/canonical';
import { DeepReadonly } from '../../contracts/deep-readonly.type';
import { DbtParserService } from '../parser/dbt-parser.service';
import { DbtCsmMapper } from '../mapper/dbt-csm.mapper';
import { SemanticModelValidator } from '../../validation/semantic-model-validator';
import { SemanticModelCache } from '../../cache/semantic-model-cache';

@Injectable()
export class DbtSemanticLoaderService {

    constructor(
        private readonly parser: DbtParserService,
        private readonly mapper: DbtCsmMapper,
        private readonly validator: SemanticModelValidator,
        private readonly cache: SemanticModelCache,
    ) {}

    async load(
        projectRoot: string,
    ): Promise<
        DeepReadonly<CanonicalSemanticModel>
    > {

        if (!projectRoot?.trim()) {
            throw new BadRequestException(
                'dbt project root is required.',
            );
        }

        const dto = await this.parser.parseProject(projectRoot);
        const model = this.mapper.map(dto);
        this.validator.assertValid(model);

        return this.cache.set(model);
    }

    get(): DeepReadonly<CanonicalSemanticModel> | undefined {
        return this.cache.get();
    }

    has(): boolean {
        return this.cache.has();
    }

    clear(): void {
        this.cache.clear();
    }

    getLoadedAt(): Date | undefined {
        return this.cache.getLoadedAt();
    }

    async reload(
        projectRoot: string,
    ): Promise<
        DeepReadonly<CanonicalSemanticModel>
    > {

        this.clear();

        return this.load(projectRoot);
    }
}