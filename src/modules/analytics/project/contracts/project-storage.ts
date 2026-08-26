export interface StoredProject {
    readonly assetId: string;
    readonly assetUrl: string;
    readonly publicId: string;
    readonly originalName: string;
    readonly size: number;
}

export interface ProjectStorage {

    upload(
        tenantId: string,
        projectId: string,
        file: Buffer,
        originalName: string,
    ): Promise<StoredProject>;

    download(
        assetId: string,
    ): Promise<Buffer>;

    delete(
        assetId: string,
    ): Promise<void>;
}