export enum DbtDimensionType {
    TIME = 'time',
    CATEGORICAL = 'categorical',
}

export interface DbtDimensionTypeParams {
    time_granularity?: string;
}

export interface DbtDimensionDto {
    /**
     * Dimension name.
     */
    name: string;

    /**
     * time | categorical
     */
    type: DbtDimensionType;

    /**
     * SQL expression.
     */
    expr?: string;

    /**
     * Optional description.
     */
    description?: string;

    /**
     * dbt type params.
     */
    type_params?: DbtDimensionTypeParams;
}