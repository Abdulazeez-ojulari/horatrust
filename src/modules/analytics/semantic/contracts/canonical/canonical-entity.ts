export type CanonicalEntityType =
    | 'primary'
    | 'unique'
    | 'natural'
    | 'foreign';

export interface CanonicalEntity {
    readonly name: string;
    readonly type: CanonicalEntityType;
    readonly description?: string;
    readonly expression?: string;
}