import { Injectable } from '@nestjs/common';
import { DbtAdapter, DbtAdapterContext } from '../contracts/dbt-adapter';
import { DbtManifest, DbtManifestNode } from '../contracts/dbt-manifest';
import { CanonicalSemanticModel } from '../../semantic/contracts';

@Injectable()
export class DbtSemanticAdapterService implements DbtAdapter {

    adapt(
        manifest: DbtManifest,
        context: DbtAdapterContext,
    ): CanonicalSemanticModel {

        const nodes = Object.values(manifest.nodes ?? {});

        const models =
            nodes
                .filter(node => node.resource_type === 'model')
                .map(node => this.toModel(node));

        return {
            version: '1.0',
            source: {
                type: 'dbt',
                tenantId: context.tenantId,
                projectId: context.projectId,
            },
            models,
            relationships: this.extractRelationships(nodes),
            metrics: [],
            dimensions: [],
        };
    }

    private toModel(
        node: DbtManifestNode,
    ): CanonicalModel {

        const columns =
            Object.values(
                node.columns ?? {},
            ).map(column => this.toColumn(column));

        return {
            name: node.name,
            description: node.description,
            database: node.database,
            schema: node.schema,
            relation: node.relation_name ?? node.alias,
            columns,
        };
    }

    private toColumn(
        column: any,
    ): CanonicalColumn {

        return {
            name: column.name,
            description: column.description,
            dataType: column.data_type,
            isPii: this.isPii(column),
        };
    }

    private isPii(
        column: any,
    ): boolean {

        const description = column.description ?.toLowerCase() ?? '';

        return (
            description.includes('pii') ||
            description.includes('personally identifiable')
        );
    }

    private extractRelationships(
        nodes: DbtManifestNode[],
    ) {

        // Relationships will be populated
        // from DBT metadata in the next
        // relationship-specific enhancement.

        return [];
    }
}