import { Module } from '@nestjs/common';
// import { PowerBiSemanticProvider } from './semantic/powerbi/provider/powerbi.provider';
import { SemanticProviderFactory } from './semantic/registry/semantic-provider.factory';
// import { PowerBiSemanticLoaderService } from './semantic/powerbi/loader/powerbi-semantic-loader.service';
import { DbtParserService } from './semantic/dbt/parser/dbt-parser.service';
import { DbtProjectDiscoveryService } from './semantic/dbt/parser/dbt-project-discovery.service';
import { DbtYamlReaderService } from './semantic/dbt/parser/dbt-yaml-reader.service';
import { DbtDocumentParserService } from './semantic/dbt/parser/dbt-document-parser.service';
import { DbtFileParserService } from './semantic/dbt/parser/dbt-file-parser.service';
import { EntityMapper } from './semantic/dbt/mapper/entity.mapper';
import { DimensionMapper } from './semantic/dbt/mapper/dimension.mapper';
import { MeasureMapper } from './semantic/dbt/mapper/measure.mapper';
import { MetricMapper } from './semantic/dbt/mapper/metric.mapper';
import { SavedQueryMapper } from './semantic/dbt/mapper/saved-query.mapper';
import { RelationshipMapper } from './semantic/dbt/mapper/relationship.mapper';
import { DbtCsmMapper } from './semantic/dbt/mapper/dbt-csm.mapper';
import { DbtSemanticQueryEngine, DbtSemanticQueryValidator, MetricFlowClient, MetricFlowConfig, MetricFlowQueryMapper, MetricFlowResultMapper } from './semantic/dbt/metricflow';
import { DbtSemanticProvider } from './semantic/dbt/provider/dbt-semantic.provider';
import { DbtSemanticLoaderService } from './semantic/dbt/loader/dbt-semantic-loader.service';
import { SemanticModelValidator } from './semantic/validation/semantic-model-validator';
import { SemanticModelCache } from './semantic/cache/semantic-model-cache';
import { SemanticProviderRegistry } from './semantic/registry/semantic-provider.registry';
import semanticConfig from './semantic/config/semantic.config';
import { ConfigModule } from '@nestjs/config';
import { SemanticContextBuilder } from './llm/planner/semantic-context.builder';
import { SemanticQueryPlanner } from './llm/planner/semantic-query-planner';
import { OpenAiConfig } from './llm/openai/openai.config';
import { OpenAiLlmProvider } from './llm/openai/openai-llm.provider';
import { LlmProviderRegistry } from './llm/registry/llm-provider.registry';
import { AnalyticsQueryService } from './application/analytics-query.service';
import { AnalyticsController } from './api/analytics.controller';
import { SemanticModelService } from './application/semantic-model.service';
import { SemanticModelController } from './api/semantic-model.controller';
import { OllamaLlmProvider } from './llm/ollama/ollama-llm.provider';
import { OllamaConfig } from './llm/ollama/ollama.config';
import { ExecutiveAnswerGenerator } from './answer/generator';
import { InsightAnalyzer } from './answer/analysis/insight-analyzer';
import { AnswerContextBuilder } from './answer/analysis/answer-context.builder';
import { InsightCalculator } from './answer/analysis/insight-calculator';
import { ProjectContextService } from './project/services/project-context.service';
import { ProjectIngestionService } from './project/services/project-ingestion.service';
import { DbtProjectController } from './project/controllers/dbt-project.controller';
import { CloudinaryProjectStorage } from './project/storage/cloudinary-project-storage';
import { ProjectWorkspaceService } from './project/services/project-workspace.service';
import { ProjectExtractionService } from './project/services/project-extraction.service';
import { DbtProjectLocatorService } from './project/services/dbt-project-locator.service';
import { DbtProjectUploadService } from './project/services/dbt-project-upload.service';
import { DbtRunnerService } from './project/services/dbt-runner.service';
import { DbtValidationService } from './project/services/dbt-validation.service';
import { DbtJobRepository } from './project/services/dbt-job.repository';
import { DbtValidationWorkerService } from './project/services/dbt-validation-worker.service';
import { DbtJobService } from './project/services/dbt-job.service';
import { DbtProjectValidationWorkflowService } from './project/services/dbt-project-validation-workflow.service';
import { DbtArtifactReaderService } from './project/services/dbt-artifact-reader.service';
import { DbtArtifactPathService } from './project/services/dbt-artifact-path.service';
import { DbtSemanticAdapterService } from './project/services/dbt-semantic-adapter.service';
import { DbtSemanticModelBuilderService } from './project/services/dbt-semantic-model-builder.service';

@Module({

    imports: [
        ConfigModule.forFeature(semanticConfig),
    ],

    controllers: [
        AnalyticsController,
        SemanticModelController,
        DbtProjectController,
    ],
    
    providers: [

        DbtSemanticProvider,
        // PowerBiSemanticProvider,
        SemanticProviderFactory,
        SemanticProviderRegistry,
        SemanticModelCache,
        SemanticModelValidator,
        DbtSemanticLoaderService,

        // PowerBiSemanticLoaderService,

        DbtParserService,
        DbtProjectDiscoveryService,
        DbtYamlReaderService,
        DbtDocumentParserService,
        DbtFileParserService,

        EntityMapper,
        DimensionMapper,
        MeasureMapper,
        MetricMapper,
        SavedQueryMapper,
        RelationshipMapper,
        DbtCsmMapper,

        SemanticModelValidator,
        SemanticModelCache,
        DbtSemanticLoaderService,
        DbtSemanticProvider,

        {
            provide: 'REGISTERED_SEMANTIC_PROVIDERS',
            inject: [
                SemanticProviderRegistry,
                DbtSemanticProvider,
            ],
            useFactory: (
                registry: SemanticProviderRegistry,
                dbtProvider: DbtSemanticProvider,
            ): SemanticProviderRegistry => {

                registry.register(
                    dbtProvider,
                );

                return registry;
            },
        },

        MetricFlowClient,
        MetricFlowQueryMapper,
        MetricFlowConfig,
        MetricFlowResultMapper,
        DbtSemanticQueryValidator,

        DbtSemanticQueryEngine,

        // LLM

        OpenAiConfig,
        OpenAiLlmProvider,

        SemanticContextBuilder,
        SemanticQueryPlanner,

        LlmProviderRegistry,

        OllamaConfig,
        OllamaLlmProvider,
        {
            provide: 'REGISTERED_LLM_PROVIDERS',

            inject: [
                LlmProviderRegistry,
                OpenAiLlmProvider,
                OllamaLlmProvider,
            ],

            useFactory: (
                registry: LlmProviderRegistry,
                openAiProvider: OpenAiLlmProvider,
                ollamaProvider: OllamaLlmProvider,
            ): LlmProviderRegistry => {
                registry.register(openAiProvider);
                registry.register(ollamaProvider);

                return registry;
            },
        },
        AnalyticsQueryService,
        SemanticModelService,

        InsightAnalyzer,
        InsightCalculator,
        AnswerContextBuilder,
        ExecutiveAnswerGenerator,

        ///PROJECT//////////

        // ProjectContextService,

        // ProjectIngestionService,

        // CloudinaryProjectStorage,

        // {
        //     provide: 'ProjectStorage',
        //     useExisting: CloudinaryProjectStorage,
        // },

        // ProjectWorkspaceService,

        // ProjectExtractionService,

        // DbtProjectLocatorService,

        // DbtProjectUploadService,

        // DbtRunnerService,

        // DbtValidationService,

        // DbtJobRepository,

        // DbtValidationWorkerService,

        // DbtJobService,

        // DbtProjectValidationWorkflowService,

        // DbtArtifactReaderService,

        // DbtArtifactPathService,

        // DbtSemanticAdapterService,

        // DbtSemanticModelBuilderService,

    ],
    exports: [
        DbtSemanticProvider,
        SemanticProviderRegistry,
        AnalyticsQueryService,
    ],
})
export class AnalyticsModule {}