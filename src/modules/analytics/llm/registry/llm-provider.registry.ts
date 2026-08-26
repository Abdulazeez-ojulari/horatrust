import { Injectable, NotFoundException } from '@nestjs/common';
import { LlmProvider, LlmProviderType } from '../contracts';

@Injectable()
export class LlmProviderRegistry {

    private readonly providers =
        new Map<
            LlmProviderType,
            LlmProvider
        >();

    register(
        provider: LlmProvider,
    ): void {

        this.providers.set(
            provider.type,
            provider,
        );
    }

    get(
        type: LlmProviderType,
    ): LlmProvider {
        const provider = this.providers.get(type);

        if (!provider) {
            throw new NotFoundException(
                `LLM provider '${type}' is not registered.`,
            );
        }

        return provider;
    }

    has(
        type: LlmProviderType,
    ): boolean {
        return this.providers.has(type);
    }

    list(): LlmProviderType[] {
        return Array.from(this.providers.keys());
    }

    remove(
        type: LlmProviderType,
    ): boolean {
        return this.providers.delete(type);
    }

    clear(): void {
        this.providers.clear();
    }
}