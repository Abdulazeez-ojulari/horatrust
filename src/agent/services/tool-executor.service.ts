import { Injectable } from '@nestjs/common';
import { ToolResult } from '../interfaces/tool-result.interface';
import { SemanticApiService } from './semantic-api.service';

@Injectable()
export class ToolExecutorService {
    constructor(
        private readonly semanticApi: SemanticApiService,
    ) {}

    async execute(
        capabilities: string[],
    ): Promise<ToolResult[]> {
        const results: ToolResult[] = [];

        for (const capability of capabilities) {
            const data = await this.semanticApi.fetch(capability);

            results.push({
                capability,
                data,
            });
        }

        return results;
    }
}

// import { Injectable } from '@nestjs/common';

// import { ToolResult } from '../interfaces/tool-result.interface';
// import { ToolRegistryService } from './tool-registry.service';

// @Injectable()
// export class ToolExecutorService {
//     constructor(
//         private readonly registry: ToolRegistryService,
//     ) {}

//     async execute(
//         capabilities: string[],
//     ): Promise<ToolResult[]> {
//         const results: ToolResult[] = [];

//         for (const capability of capabilities) {
//             const tool = this.registry.find(capability);

//             if (!tool) {
//                 continue;
//             }

//             results.push({
//                 capability,
//                 data: this.mock(capability),
//             });
//         }

//         return results;
//     }

//     private mock(capability: string): unknown {
//         switch (capability) {
//             case 'revenue':
//                 return {
//                     currentMonth: 850000,
//                     previousMonth: 1000000,
//                     change: -15,
//                 };

//             case 'orders':
//                 return {
//                     currentMonth: 2300,
//                     previousMonth: 2500,
//                     change: -8,
//                 };

//             case 'expenses':
//                 return {
//                     currentMonth: 300000,
//                     previousMonth: 280000,
//                     change: 7,
//                 };

//             case 'customers':
//                 return {
//                     currentMonth: 410,
//                     previousMonth: 470,
//                     change: -12,
//                 };

//             default:
//                 return {};
//         }
//     }
// }