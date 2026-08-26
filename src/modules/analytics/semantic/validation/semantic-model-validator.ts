import { Injectable } from '@nestjs/common';
import { CanonicalSemanticModel, CanonicalSemanticModelDefinition } from '../contracts/canonical';

export interface SemanticValidationError {
    readonly code: string;
    readonly message: string;
    readonly path: string;
}

export interface SemanticValidationResult {
    readonly valid: boolean;
    readonly errors: readonly SemanticValidationError[];
}

@Injectable()
export class SemanticModelValidator {

    validate(
        model: CanonicalSemanticModel,
    ): SemanticValidationResult {

        const errors: SemanticValidationError[] = [];

        this.validateSemanticModels(model, errors);
        this.validateMetrics(model, errors);
        this.validateSavedQueries(model, errors);
        this.validateRelationships(model, errors);

        return {
            valid: errors.length === 0,
            errors,
        };
    }

    assertValid(
        model: CanonicalSemanticModel,
    ): void {

        const result = this.validate(model);

        if (!result.valid) {
            const message = result.errors
                .map(error => `${error.path}: ${error.message}`)
                .join('; ');

            throw new Error(
                `Invalid semantic model: ${message}`,
            );
        }
    }

    private validateSemanticModels(
        model: CanonicalSemanticModel,
        errors: SemanticValidationError[],
    ): void {

        const names = new Set<string>();

        model.semanticModels.forEach(
            (
                semanticModel,
                index,
            ) => {

                const path = `semanticModels[${index}]`;

                this.requireString(
                    semanticModel.name,
                    `${path}.name`,
                    'Semantic model name is required.',
                    errors,
                );

                this.requireString(
                    semanticModel.model,
                    `${path}.model`,
                    'Semantic model model reference is required.',
                    errors,
                );

                this.checkDuplicate(
                    semanticModel.name,
                    names,
                    `${path}.name`,
                    'Duplicate semantic model name.',
                    errors,
                );

                this.validateEntities(
                    semanticModel,
                    path,
                    errors,
                );

                this.validateDimensions(
                    semanticModel,
                    path,
                    errors,
                );

                this.validateMeasures(
                    semanticModel,
                    path,
                    errors,
                );
            },
        );
    }

    private validateEntities(
        semanticModel: CanonicalSemanticModelDefinition,
        path: string,
        errors: SemanticValidationError[],
    ): void {

        const names = new Set<string>();

        semanticModel.entities.forEach(
            (entity, index) => {

                const entityPath = `${path}.entities[${index}]`;

                this.requireString(
                    entity.name,
                    `${entityPath}.name`,
                    'Entity name is required.',
                    errors,
                );

                this.checkDuplicate(
                    entity.name,
                    names,
                    `${entityPath}.name`,
                    'Duplicate entity name.',
                    errors,
                );

                if (
                    entity.type === 'foreign' &&
                    !entity.expression
                ) {
                    errors.push({
                        code: 'FOREIGN_ENTITY_EXPRESSION_MISSING',
                        message: 'Foreign entities should define an expression.',
                        path: entityPath,
                    });
                }
            },
        );
    }

    private validateDimensions(
        semanticModel: CanonicalSemanticModelDefinition,
        path: string,
        errors: SemanticValidationError[],
    ): void {

        const names = new Set<string>();

        semanticModel.dimensions.forEach(
            (dimension, index) => {

                const dimensionPath = `${path}.dimensions[${index}]`;

                this.requireString(
                    dimension.name,
                    `${dimensionPath}.name`,
                    'Dimension name is required.',
                    errors,
                );

                this.checkDuplicate(
                    dimension.name,
                    names,
                    `${dimensionPath}.name`,
                    'Duplicate dimension name.',
                    errors,
                );

                if (
                    dimension.type === 'time' &&
                    dimension.typeParams?.timeGranularity ===
                        undefined
                ) {
                    errors.push({
                        code: 'TIME_GRANULARITY_MISSING',
                        message: 'Time dimension is missing its time granularity.',
                        path: dimensionPath,
                    });
                }
            },
        );
    }

    private validateMeasures(
        semanticModel: CanonicalSemanticModelDefinition,
        path: string,
        errors: SemanticValidationError[],
    ): void {

        const names = new Set<string>();

        semanticModel.measures.forEach(
            (measure, index) => {

                const measurePath = `${path}.measures[${index}]`;

                this.requireString(
                    measure.name,
                    `${measurePath}.name`,
                    'Measure name is required.',
                    errors,
                );

                this.checkDuplicate(
                    measure.name,
                    names,
                    `${measurePath}.name`,
                    'Duplicate measure name.',
                    errors,
                );

                this.requireString(
                    measure.aggregation,
                    `${measurePath}.aggregation`,
                    'Measure aggregation is required.',
                    errors,
                );
            },
        );
    }

    private validateMetrics(
        model: CanonicalSemanticModel,
        errors: SemanticValidationError[],
    ): void {

        const names = new Set<string>();

        model.metrics.forEach(
            (metric, index) => {

                const path = `metrics[${index}]`;

                this.requireString(
                    metric.name,
                    `${path}.name`,
                    'Metric name is required.',
                    errors,
                );

                this.checkDuplicate(
                    metric.name,
                    names,
                    `${path}.name`,
                    'Duplicate metric name.',
                    errors,
                );

                if (
                    metric.type === 'simple' &&
                    !metric.typeParams.measure
                ) {
                    errors.push({
                        code: 'SIMPLE_METRIC_MEASURE_MISSING',
                        message: 'Simple metric requires a measure.',
                        path: `${path}.typeParams.measure`,
                    });
                }

                if (
                    metric.type === 'ratio'
                ) {
                    if (
                        !metric.typeParams.numerator
                    ) {
                        errors.push({
                            code: 'RATIO_NUMERATOR_MISSING',
                            message: 'Ratio metric requires a numerator.',
                            path: `${path}.typeParams.numerator`,
                        });
                    }

                    if (
                        !metric.typeParams.denominator
                    ) {
                        errors.push({
                            code: 'RATIO_DENOMINATOR_MISSING',
                            message: 'Ratio metric requires a denominator.',
                            path: `${path}.typeParams.denominator`,
                        });
                    }
                }

                if (
                    metric.type === 'derived' &&
                    (
                        !metric.typeParams.metrics ||
                        metric.typeParams.metrics.length === 0
                    )
                ) {
                    errors.push({
                        code: 'DERIVED_METRICS_MISSING',
                        message: 'Derived metric requires at least one metric.',
                        path: `${path}.typeParams.metrics`,
                    });
                }
            },
        );
    }

    private validateSavedQueries(
        model: CanonicalSemanticModel,
        errors: SemanticValidationError[],
    ): void {

        const names = new Set<string>();

        model.savedQueries.forEach(
            (query, index) => {

                const path = `savedQueries[${index}]`;

                this.requireString(
                    query.name,
                    `${path}.name`,
                    'Saved query name is required.',
                    errors,
                );

                this.checkDuplicate(
                    query.name,
                    names,
                    `${path}.name`,
                    'Duplicate saved query name.',
                    errors,
                );

                if (
                    query.metrics.length === 0
                ) {
                    errors.push({
                        code: 'SAVED_QUERY_METRICS_MISSING',
                        message: 'Saved query must contain at least one metric.',
                        path: `${path}.metrics`,
                    });
                }
            },
        );
    }

    private validateRelationships(
        model: CanonicalSemanticModel,
        errors: SemanticValidationError[],
    ): void {

        model.relationships.forEach(
            (relationship, index) => {

                const path = `relationships[${index}]`;

                const sourceModel =
                    this.findSemanticModel(
                        model,
                        relationship.sourceModel,
                    );

                if (!sourceModel) {
                    errors.push({
                        code: 'RELATIONSHIP_SOURCE_MODEL_NOT_FOUND',
                        message: `Source model '${relationship.sourceModel}' does not exist.`,
                        path: `${path}.sourceModel`,
                    });

                    return;
                }

                const targetModel =
                    this.findSemanticModel(
                        model,
                        relationship.targetModel,
                    );

                if (!targetModel) {
                    errors.push({
                        code: 'RELATIONSHIP_TARGET_MODEL_NOT_FOUND',
                        message: `Target model '${relationship.targetModel}' does not exist.`,
                        path: `${path}.targetModel`,
                    });

                    return;
                }

                const sourceEntity =
                    sourceModel.entities.some(
                        entity => entity.name === relationship.sourceEntity,
                    );

                if (!sourceEntity) {
                    errors.push({
                        code: 'RELATIONSHIP_SOURCE_ENTITY_NOT_FOUND',
                        message: `Source entity '${relationship.sourceEntity}' does not exist on model '${relationship.sourceModel}'.`,
                        path: `${path}.sourceEntity`,
                    });
                }

                const targetEntity =
                    targetModel.entities.some(
                        entity => entity.name === relationship.targetEntity,
                    );

                if (!targetEntity) {
                    errors.push({
                        code: 'RELATIONSHIP_TARGET_ENTITY_NOT_FOUND',
                        message: `Target entity '${relationship.targetEntity}' does not exist on model '${relationship.targetModel}'.`,
                        path: `${path}.targetEntity`,
                    });
                }
            },
        );
    }

    private findSemanticModel(
        model: CanonicalSemanticModel,
        name: string,
    ): CanonicalSemanticModelDefinition | undefined {

        return model.semanticModels.find(
            semanticModel => semanticModel.name === name,
        );
    }

    private requireString(
        value: string | undefined,
        path: string,
        message: string,
        errors: SemanticValidationError[],
    ): void {

        if (
            typeof value !== 'string' ||
            value.trim().length === 0
        ) {
            errors.push({
                code: 'REQUIRED_VALUE_MISSING',
                message,
                path,
            });
        }
    }

    private checkDuplicate(
        value: string,
        names: Set<string>,
        path: string,
        message: string,
        errors: SemanticValidationError[],
    ): void {

        if (names.has(value)) {
            errors.push({
                code: 'DUPLICATE_NAME',
                message,
                path,
            });

            return;
        }

        names.add(value);
    }
}