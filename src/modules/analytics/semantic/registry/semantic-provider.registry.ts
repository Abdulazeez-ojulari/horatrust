import { Injectable, NotFoundException } from '@nestjs/common';
import { SemanticProvider, SemanticProviderType } from '../contracts';

@Injectable()
export class SemanticProviderRegistry {

    private readonly providers =
        new Map<
            SemanticProviderType,
            SemanticProvider
        >();

    register(
        provider: SemanticProvider,
    ): void {

        this.providers.set(
            provider.type,
            provider,
        );
    }

    get(
        type: SemanticProviderType,
    ): SemanticProvider {

        const provider = this.providers.get(type);

        if (!provider) {
            throw new NotFoundException(
                `Semantic provider '${type}' is not registered.`,
            );
        }

        return provider;
    }

    has(
        type: SemanticProviderType,
    ): boolean {
        return this.providers.has(type);
    }

    remove(
        type: SemanticProviderType,
    ): boolean {
        return this.providers.delete(type);
    }

    clear(): void {
        this.providers.clear();
    }

    list(): SemanticProviderType[] {

        return Array.from(
            this.providers.keys(),
        );
    }
}