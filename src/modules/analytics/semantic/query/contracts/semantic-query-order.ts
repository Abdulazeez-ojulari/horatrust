export type SemanticOrderDirection =
    | 'asc'
    | 'desc';

export interface SemanticQueryOrder {
    readonly field: string;
    readonly direction: SemanticOrderDirection;
}