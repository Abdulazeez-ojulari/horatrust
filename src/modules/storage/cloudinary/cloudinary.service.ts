import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {

    constructor() {

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    async uploadProject(
        file: Buffer,
        tenantId: string,
        projectId: string,
        version: number,
    ) {

        const publicId = `dbt-projects/${tenantId}/${projectId}/v${version}`;

        return new Promise<{
            publicId: string;
            secureUrl: string;
            resourceType: string;
        }>(
            (
                resolve,
                reject,
            ) => {

                const uploadStream =
                    cloudinary.uploader.upload_stream(
                        {
                            public_id: publicId,

                            resource_type: 'raw',

                            overwrite: false,
                        },

                        (
                            error,
                            result,
                        ) => {

                            if (error) {
                                reject(
                                    new InternalServerErrorException(error.message),
                                );

                                return;
                            }

                            if (!result) {
                                reject(
                                    new InternalServerErrorException(
                                        'Cloudinary upload returned no result.',
                                    ),
                                );

                                return;
                            }

                            resolve({
                                publicId: result.public_id,
                                secureUrl: result.secure_url,
                                resourceType: result.resource_type,
                            });
                        },
                    );

                Readable.from(file).pipe(uploadStream);
            },
        );
    }

    async downloadProject(
        publicId: string,
    ): Promise<Buffer> {

        const url =
            cloudinary.url(
                publicId,
                {
                    resource_type: 'raw',
                    secure: true,
                },
            );

        const response = await fetch(url);

        if (!response.ok) {
            throw new InternalServerErrorException(
                `Unable to download project from Cloudinary: ${response.status}`,
            );
        }

        return Buffer.from(
            await response.arrayBuffer(),
        );
    }
}