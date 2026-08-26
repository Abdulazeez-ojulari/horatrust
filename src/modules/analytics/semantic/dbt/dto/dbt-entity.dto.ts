export enum DbtEntityType {
    PRIMARY = 'primary',
    UNIQUE = 'unique',
    NATURAL = 'natural',
    FOREIGN = 'foreign',
}

export interface DbtEntityExpr {
    sql?: string;
    column?: string;
}

export interface DbtEntityDto {
    /**
     * Entity name.
     * Example:
     * customer
     */
    name: string;

    /**
     * primary | unique | natural | foreign
     */
    type: DbtEntityType;

    /**
     * Optional SQL expression.
     */
    expr?: string;

    /**
     * Optional description.
     */
    description?: string;
}