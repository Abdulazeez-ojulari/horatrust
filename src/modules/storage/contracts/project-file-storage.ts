export interface ProjectFileStorage {

    uploadProject(
        file: Buffer,
        tenantId: string,
        projectId: string,
        version: number,
    ): Promise<{
        publicId: string;
        secureUrl: string;
        resourceType: string;
    }>;

    downloadProject(
        publicId: string,
    ): Promise<Buffer>;
}