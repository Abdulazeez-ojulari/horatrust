import { Injectable } from '@nestjs/common';
import { DbtMetricDto, DbtSavedQueryDto, DbtSemanticLayerDto, DbtSemanticModelDto } from '../dto';

@Injectable()
export class DbtFileParserService {

    parse(
        document: Record<string, unknown>,
    ): DbtSemanticLayerDto {

        return {
            semantic_models: this.semanticModels(document),
            metrics: this.metrics(document),
            saved_queries: this.savedQueries(document),
        };

    }

    private semanticModels(
        document: Record<string, unknown>,
    ): DbtSemanticModelDto[] {

        const models = document.semantic_models;

        if (!Array.isArray(models)) {
            return [];
        }

        return models as DbtSemanticModelDto[];

    }

    private metrics(
        document: Record<string, unknown>,
    ): DbtMetricDto[] {

        const metrics = document.metrics;

        if (!Array.isArray(metrics)) {
            return [];
        }

        return metrics as DbtMetricDto[];
    }

    private savedQueries(
        document: Record<string, unknown>,
    ): DbtSavedQueryDto[] {

        const queries = document.saved_queries;

        if (!Array.isArray(queries)) {
            return [];
        }

        return queries as DbtSavedQueryDto[];
    }

}