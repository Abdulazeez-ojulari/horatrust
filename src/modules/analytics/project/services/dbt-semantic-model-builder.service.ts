import { Injectable } from "@nestjs/common";
import { DbtArtifactPathService } from "./dbt-artifact-path.service";
import { DbtArtifactReaderService } from "./dbt-artifact-reader.service";
import { DbtSemanticAdapterService } from "./dbt-semantic-adapter.service";
import { CanonicalSemanticModel } from "../../semantic/contracts";

@Injectable()
export class DbtSemanticModelBuilderService {

    constructor(
        private readonly artifactPaths: DbtArtifactPathService,
        private readonly artifactReader: DbtArtifactReaderService,
        private readonly adapter: DbtSemanticAdapterService,
    ) {}

    async build(
        tenantId: string,
        projectId: string,
        projectDirectory: string,
    ): Promise<CanonicalSemanticModel> {

        const manifestPath = this.artifactPaths.manifestPath(projectDirectory);
        const manifest = await this.artifactReader.readManifest(manifestPath);

        return this.adapter.adapt(
            manifest,
            {
                tenantId,
                projectId,
            },
        );
    }
}