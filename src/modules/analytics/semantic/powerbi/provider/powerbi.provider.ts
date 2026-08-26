// import { Injectable } from '@nestjs/common';
// import { SemanticProvider, SemanticProviderType } from '../../contracts';
// import { CanonicalSemanticModel } from '../../contracts/canonical-semantic-model';
// import { DeepReadonly } from '../../contracts';
// import { DbtSemanticLoaderService } from '../../dbt/loader/dbt-semantic-loader.service';
// import { PowerBiSemanticLoaderService } from '../loader/powerbi-semantic-loader.service';

// @Injectable()
// export class PowerBiSemanticProvider implements SemanticProvider {

//     constructor(
//         private readonly loader: PowerBiSemanticLoaderService,
//     ) {}

//     readonly type = SemanticProviderType.POWER_BI;

//     async load(
//         source: string,
//     ): Promise<
//         DeepReadonly<CanonicalSemanticModel>
//     > {

//         return this.loader.load(source);
//     }

//     getModel():
//         DeepReadonly<CanonicalSemanticModel> |
//         undefined {

//         return this.loader.get();
//     }

//     isLoaded(): boolean {
//         return this.loader.has();
//     }

//     clear(): void {
//         this.loader.clear();
//     }

// }