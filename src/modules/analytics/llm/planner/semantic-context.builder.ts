import { Injectable } from '@nestjs/common';
import { CanonicalSemanticModel } from '../../semantic/contracts/canonical';

@Injectable()
export class SemanticContextBuilder {
    build(
        model: CanonicalSemanticModel,
    ): unknown {

        return {
            semanticModels:
                model.semanticModels.map(
                    semanticModel => ({
                        name: semanticModel.name,
                        description: semanticModel.description,
                        entities: semanticModel.entities,
                        dimensions: semanticModel.dimensions,
                        measures: semanticModel.measures,
                    }),
                ),

            metrics:
                model.metrics.map(
                    metric => ({
                        name: metric.name,
                        label: metric.label,
                        description: metric.description,
                        type: metric.type,
                        typeParams: metric.typeParams,
                    }),
                ),

            relationships: model.relationships,
        };
    }
}