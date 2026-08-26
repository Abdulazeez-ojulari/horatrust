import { CanonicalSemanticModel } from '../../semantic/contracts';
import { DbtManifest } from './dbt-manifest';

export interface DbtAdapterContext {
    readonly tenantId: string;
    readonly projectId: string;
}

export interface DbtAdapter {
    adapt(
        manifest: DbtManifest,
        context: DbtAdapterContext,
    ): CanonicalSemanticModel;
}