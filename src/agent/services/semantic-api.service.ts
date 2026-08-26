import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SemanticApiService {
    constructor(
        private readonly http: HttpService,
        private readonly config: ConfigService,
    ) {}

    async fetch(capability: string) {
        const baseUrl = this.config.get<string>('semanticApi.baseUrl');
        const apiKey = this.config.get<string>('semanticApi.apiKey');

        const response = await firstValueFrom(
            this.http.get(
                `${baseUrl}/capabilities/${capability}`,
                {
                headers: {
                    'x-api-key': apiKey,
                },
                },
            ),
        );

        return response.data;
    }
}