import { Injectable } from '@nestjs/common';
import { DbtSemanticLayerDto } from '../dto';
import { DbtProjectDiscoveryService } from './dbt-project-discovery.service';
import { DbtYamlReaderService } from './dbt-yaml-reader.service';
import { DbtDocumentParserService } from './dbt-document-parser.service';
import { DbtFileParserService } from './dbt-file-parser.service';

@Injectable()
export class DbtParserService {

    constructor(
        private readonly discovery: DbtProjectDiscoveryService,
        private readonly reader: DbtYamlReaderService,
        private readonly documentParser: DbtDocumentParserService,
        private readonly fileParser: DbtFileParserService,
    ) {}

    async parseProject(
        projectRoot: string,
    ): Promise<DbtSemanticLayerDto> {

        const files = await this.discovery.discover(projectRoot);
        const yamlDocuments = await this.reader.readMany(files);

        const semanticModels = [];
        const metrics = [];
        const savedQueries = [];

        for (const [file, yaml] of yamlDocuments) {

            const document =
                this.documentParser.parse(
                    file,
                    yaml,
                );

            const parsed =
                this.fileParser.parse(
                    document,
                );

            semanticModels.push(...parsed.semantic_models);
            metrics.push(...parsed.metrics);
            savedQueries.push(...(parsed.saved_queries ?? []));

        }

        return {
            semantic_models: semanticModels,
            metrics,
            saved_queries: savedQueries,
            metadata: {
                generatedAt: new Date().toISOString(),
            },

        };

    }

}