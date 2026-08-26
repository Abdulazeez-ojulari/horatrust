export type ProjectSourceType =
    | 'upload';

export interface AnalyticsProjectSource {
    readonly id: string;
    readonly projectId: string;
    readonly type: 'cloudinary';
    readonly assetId: string;
    readonly assetUrl: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}