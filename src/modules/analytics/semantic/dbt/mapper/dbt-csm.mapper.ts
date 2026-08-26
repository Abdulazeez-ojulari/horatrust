import { Injectable } from '@nestjs/common';
import { DbtSemanticLayerDto, DbtSemanticModelDto } from '../dto';
import { CanonicalSemanticModel, CanonicalSemanticModelDefinition } from '../../contracts/canonical';
import { EntityMapper } from './entity.mapper';
import { DimensionMapper } from './dimension.mapper';
import { MeasureMapper } from './measure.mapper';
import { MetricMapper } from './metric.mapper';
import { SavedQueryMapper } from './saved-query.mapper';
import { RelationshipMapper } from './relationship.mapper';

@Injectable()
export class DbtCsmMapper {

    constructor(
        private readonly entityMapper: EntityMapper,
        private readonly dimensionMapper: DimensionMapper,
        private readonly measureMapper: MeasureMapper,
        private readonly metricMapper: MetricMapper,
        private readonly savedQueryMapper: SavedQueryMapper,
        private readonly relationshipMapper: RelationshipMapper,
    ) {}

    map(
        source: DbtSemanticLayerDto,
    ): CanonicalSemanticModel {

        const semanticModels =
            source.semantic_models.map(
                model => this.mapSemanticModel(model),
            );

        return {
            metadata: source.metadata
                ? {
                    dbtVersion: source.metadata.dbtVersion,
                    metricFlowVersion: source.metadata.metricFlowVersion,
                    projectName: source.metadata.projectName,
                    generatedAt: source.metadata.generatedAt,
                    meta: source.metadata.meta,
                }
                : undefined,

            semanticModels,

            metrics: this.metricMapper.mapMany(source.metrics),
            savedQueries: this.savedQueryMapper.mapMany(source.saved_queries ?? []),
            relationships: this.relationshipMapper.map(source.semantic_models),
        };
    }

    private mapSemanticModel(
        model: DbtSemanticModelDto,
    ): CanonicalSemanticModelDefinition {

        return {
            name: model.name,
            model: model.model,
            description: model.description,
            defaults: model.defaults
                ? {
                    aggTimeDimension: model.defaults.agg_time_dimension,
                }
                : undefined,

            entities: this.entityMapper.mapMany(model.entities ?? []),
            dimensions: this.dimensionMapper.mapMany(model.dimensions ?? []),
            measures: this.measureMapper.mapMany(model.measures ?? []),
        };
    }
}