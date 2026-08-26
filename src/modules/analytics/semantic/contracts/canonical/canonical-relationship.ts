export type CanonicalRelationshipType =
    | 'one_to_one'
    | 'one_to_many'
    | 'many_to_one'
    | 'many_to_many';

export interface CanonicalRelationship {
    readonly sourceModel: string;
    readonly sourceEntity: string;
    readonly targetModel: string;
    readonly targetEntity: string;
    readonly relationshipType: CanonicalRelationshipType;
}