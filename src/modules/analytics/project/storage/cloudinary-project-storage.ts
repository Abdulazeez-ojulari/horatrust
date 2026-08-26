import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { ProjectStorage, StoredProject } from '../contracts/project-storage';

@Injectable()
export class CloudinaryProjectStorage
    implements ProjectStorage {

    async upload(
        tenantId: string,
        projectId: string,
        file: Buffer,
        originalName: string,
    ): Promise<StoredProject> {

        const publicId =
            `analytics/${tenantId}/${projectId}/${this.removeExtension(
                originalName,
            )}`;

        const result =
            await new Promise<any>(
                (resolve, reject) => {
                    const uploadStream =
                        cloudinary.uploader.upload_stream(
                            {
                                resource_type: 'raw',
                                public_id: publicId,
                                overwrite: true,
                            },

                            (
                                error,
                                result,
                            ) => {

                                if (error) {
                                    reject(error);
                                    return;
                                }

                                resolve(result);
                            },
                        );

                    Readable
                        .from(file)
                        .pipe(uploadStream);
                },
            );

        if (!result) {
            throw new InternalServerErrorException(
                'Cloudinary upload failed.',
            );
        }

        return {
            assetId: result.asset_id,
            assetUrl: result.secure_url,
            publicId: result.public_id,
            originalName,
            size: file.length,
        };
    }

    async download(
        assetId: string,
    ): Promise<Buffer> {

        try {

            const resources =
                await cloudinary.api.resources_by_ids(
                    [assetId],
                    {
                        resource_type: 'raw',
                    },
                );

            const resource = resources.resources?.[0];

            if (!resource) {
                throw new Error(
                    `Cloudinary asset '${assetId}' not found.`,
                );
            }

            const response = await fetch(resource.secure_url);

            if (!response.ok) {
                throw new Error(
                    `Failed to download Cloudinary asset: ${response.status}`,
                );
            }

            return Buffer.from(
                await response.arrayBuffer(),
            );

        } catch (error) {

            throw new InternalServerErrorException(
                error instanceof Error ? error.message : 'Cloudinary download failed.',
            );
        }
    }

    async delete(
        assetId: string,
    ): Promise<void> {

        try {
            await cloudinary.api.delete_resources(
                [assetId],
                {
                    resource_type: 'raw',
                },
            );

        } catch (error) {

            throw new InternalServerErrorException(
                error instanceof Error ? error.message : 'Cloudinary deletion failed.',
            );
        }
    }

    private removeExtension(
        filename: string,
    ): string {
        return filename.replace(/\.[^/.]+$/, '');
    }
}