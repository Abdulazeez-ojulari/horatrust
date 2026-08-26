import { BadRequestException, Injectable } from '@nestjs/common';
import { SemanticQuery } from '../../query/contracts';
import { CanonicalSemanticModel } from '../../contracts/canonical';

@Injectable()
export class DbtSemanticQueryValidator {

    validate(
        query: SemanticQuery,
        model: CanonicalSemanticModel,
    ): void {

        if (
            !query.metrics ||
            query.metrics.length === 0
        ) {
            throw new BadRequestException(
                'At least one metric is required.',
            );
        }

        for (const metric of query.metrics) {

            const exists =
                model.metrics.some(
                    item => item.name === metric,
                );

            if (!exists) {
                throw new BadRequestException(
                    `Metric '${metric}' does not exist.`,
                );
            }
        }

        for (
            const dimension
            of query.dimensions ?? []
        ) {

            if (
                !this.dimensionExists(
                    dimension,
                    model,
                )
            ) {
                console.log(dimension)
                throw new BadRequestException(
                    `Dimension '${dimension}' does not exist.`,
                );
            }
        }

        if (
            query.limit !== undefined &&
            (
                query.limit < 1 ||
                query.limit > 10000
            )
        ) {
            throw new BadRequestException(
                'Limit must be between 1 and 10000.',
            );
        }

        if (
            query.offset !== undefined &&
            query.offset < 0
        ) {
            throw new BadRequestException(
                'Offset cannot be negative.',
            );
        }
    }

    private dimensionExists(
        dimension: string,
        model: CanonicalSemanticModel,
    ): boolean {

        return model.semanticModels.some(
            semanticModel =>
                semanticModel.dimensions.some(
                    item => item.name === dimension,
                ),
        );
    }
}