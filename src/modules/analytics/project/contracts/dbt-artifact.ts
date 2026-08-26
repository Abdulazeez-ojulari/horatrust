export interface DbtArtifact {
    readonly path: string;
    readonly generatedAt: Date;
    readonly manifestPath?: string;
    readonly catalogPath?: string;
}