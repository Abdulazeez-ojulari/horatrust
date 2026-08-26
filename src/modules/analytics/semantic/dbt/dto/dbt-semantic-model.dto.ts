import { DbtDimensionDto } from './dbt-dimension.dto';
import { DbtEntityDto } from './dbt-entity.dto';
import { DbtMeasureDto } from './dbt-measure.dto';

export interface DbtSemanticDefaultsDto {
    agg_time_dimension?: string;
}

export interface DbtSemanticModelDto {
    /**
     * Semantic model name.
     */
    name: string;

    /**
     * Underlying dbt model.
     */
    model: string;

    /**
     * Optional description.
     */
    description?: string;

    /**
     * Defaults.
     */
    defaults?: DbtSemanticDefaultsDto;

    /**
     * Entities.
     */
    entities: DbtEntityDto[];

    /**
     * Dimensions.
     */
    dimensions: DbtDimensionDto[];

    /**
     * Measures.
     */
    measures: DbtMeasureDto[];
}