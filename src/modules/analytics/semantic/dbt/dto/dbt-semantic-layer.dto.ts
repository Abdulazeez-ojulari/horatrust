import { DbtMetricDto } from './dbt-metric.dto';
import { DbtSavedQueryDto } from './dbt-saved-query.dto';
import { DbtSemanticModelDto } from './dbt-semantic-model.dto';
import { DbtSemanticMetadata } from './dbt-metadata.dto';

export interface DbtSemanticLayerDto {
    /**
     * Semantic models.
     */
    semantic_models: DbtSemanticModelDto[];

    /**
     * Metrics.
     */
    metrics: DbtMetricDto[];

    /**
     * Saved queries.
     */
    saved_queries?: DbtSavedQueryDto[];

    /**
     * Metadata.
     */
    metadata?: DbtSemanticMetadata;
}