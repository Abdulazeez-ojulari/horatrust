export interface DbtSqlModel {
    readonly name: string;
    readonly filePath: string;
    readonly sql: string;
    readonly dependencies: readonly DbtModelDependency[];
    readonly columns: readonly DbtSqlColumn[];
}

export interface DbtModelDependency {
    readonly modelName: string;
    readonly type:
        | 'ref'
        | 'source';
}

export interface DbtSqlColumn {
    readonly name: string;
    readonly sourceColumn?: string;
    readonly sourceModel?: string;
    readonly expression?: string;
}