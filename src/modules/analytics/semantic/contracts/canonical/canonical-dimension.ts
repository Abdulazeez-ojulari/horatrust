export type CanonicalDimensionType =
    | 'time'
    | 'categorical';

export interface CanonicalDimensionTypeParams {
    readonly timeGranularity?: string;
}

export interface CanonicalDimension {
    readonly name: string;
    readonly type: CanonicalDimensionType;
    readonly description?: string;
    readonly expression?: string;
    readonly typeParams?: CanonicalDimensionTypeParams;
}