import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LlmProviderType } from '../../llm/contracts';
import { SemanticProviderType } from '../../semantic/contracts';

export class AnalyticsQueryRequestDto {
    @IsString()
    @IsNotEmpty()
    question!: string;

    @IsOptional()
    @IsEnum(LlmProviderType)
    llmProvider?: LlmProviderType;

    @IsOptional()
    @IsEnum(SemanticProviderType)
    semanticProvider?: SemanticProviderType;
}