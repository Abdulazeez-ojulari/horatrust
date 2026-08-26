// import { BadRequestException, Injectable } from '@nestjs/common';
// import { CanonicalSemanticModel } from '../../contracts/canonical-semantic-model';
// import { SemanticModelCache } from '../../cache/semantic-model.cache';
// import { DbtParserService } from '../../dbt/parser/dbt-parser.service';
// import { DbtCsmMapper } from '../../dbt/mapper/dbt-csm.mapper';
// import { DeepReadonly } from '../../contracts';
// import { SemanticModelValidator } from '../../validation/semantic-model-validator';

// @Injectable()
// export class PowerBiSemanticLoaderService {

//     constructor(
//         private readonly validator: SemanticModelValidator,
//         private readonly cache: SemanticModelCache,
//         private readonly parser: DbtParserService,
//         private readonly mapper: DbtCsmMapper,
//     ) {}

//     async load(
//             projectRoot: string,
//         ): Promise<
//             DeepReadonly<CanonicalSemanticModel>
//         > {
    
//             if (!projectRoot?.trim()) {
//                 throw new BadRequestException(
//                     'dbt project root is required.',
//                 );
//             }
    
//             const dto = await this.parser.parseProject(
//                     projectRoot,
//                 );
    
//             const model = this.mapper.map(dto);
//             this.validator.assertValid(model);
    
//             return this.cache.set(model);
//         }

// }