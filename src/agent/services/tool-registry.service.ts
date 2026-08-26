import { Injectable } from '@nestjs/common';
import { ToolDefinition } from '../interfaces/tool.interface';

@Injectable()
export class ToolRegistryService {
    private readonly tools: ToolDefinition[] = [
        {
            capability: 'revenue',
            name: 'Revenue Service',
            description: 'Provides revenue metrics.',
        },
        {
            capability: 'orders',
            name: 'Orders Service',
            description: 'Provides order metrics.',
        },
        {
            capability: 'expenses',
            name: 'Expenses Service',
            description: 'Provides expense metrics.',
        },
        {
            capability: 'customers',
            name: 'Customer Service',
            description: 'Provides customer metrics.',
        },
    ];

    find(capability: string): ToolDefinition | undefined {
        return this.tools.find(
            (tool) => tool.capability === capability,
        );
    }

    getAll(): ToolDefinition[] {
        return this.tools;
    }
}