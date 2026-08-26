import { Injectable, BadRequestException } from '@nestjs/common';
import { SemanticProviderType } from '../semantic/contracts';
import { CanonicalSemanticModel } from '../semantic/contracts/canonical';
import { SemanticProviderRegistry } from '../semantic/registry/semantic-provider.registry';

@Injectable()
export class SemanticModelService {

    constructor(
        private readonly providerRegistry: SemanticProviderRegistry,
    ) {}

    async load(
        projectRoot: string,
        providerType: SemanticProviderType = SemanticProviderType.DBT,
    ): Promise<CanonicalSemanticModel> {

        if (!projectRoot?.trim()) {
            throw new BadRequestException(
                'Semantic model source is required.',
            );
        }

        const provider = this.providerRegistry.get(providerType);

        return provider.load(
            projectRoot,
        );
    }

    async reload(
        projectRoot: string,
        providerType: SemanticProviderType = SemanticProviderType.DBT,
    ): Promise<CanonicalSemanticModel> {

        if (!projectRoot?.trim()) {
            throw new BadRequestException(
                'Semantic model source is required.',
            );
        }

        const provider =
            this.providerRegistry.get(
                providerType,
            );

        provider.clear();

        return provider.load(
            projectRoot,
        );
    }

    status(
        providerType: SemanticProviderType = SemanticProviderType.DBT,
    ) {

        const provider = this.providerRegistry.get(providerType);

        return {
            provider: provider.type,
            loaded: provider.isLoaded(),
            model: provider.getModel(),
        };
    }

    clear(
        providerType: SemanticProviderType = SemanticProviderType.DBT,
    ): void {

        const provider = this.providerRegistry.get(providerType);

        provider.clear();
    }
}