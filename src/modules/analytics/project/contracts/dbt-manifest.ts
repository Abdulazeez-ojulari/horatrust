export interface DbtManifest {
    readonly nodes: Record<string, DbtManifestNode>;
    readonly sources?: Record<string, DbtManifestNode>;
}

export interface DbtManifestNode {
    readonly unique_id: string;
    readonly resource_type: string;
    readonly name: string;
    readonly database?: string;
    readonly schema?: string;
    readonly alias?: string;
    readonly relation_name?: string;
    readonly description?: string;
    readonly columns?: Record<string, DbtManifestColumn>;
    readonly depends_on?: { readonly nodes?: string[] };
    readonly config?: Record<string, unknown>;
    readonly meta?: Record<string, unknown>;
}

export interface DbtManifestColumn {
    readonly name: string;
    readonly description?: string;
    readonly data_type?: string;
    readonly meta?: Record<string, unknown>;
    readonly config?: Record<string, unknown>;
}