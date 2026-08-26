import { Injectable } from '@nestjs/common';
import { DbtSemanticModelDto } from '../dto';
import { CanonicalRelationship } from '../../contracts/canonical/canonical-relationship';

@Injectable()
export class RelationshipMapper {

    map(
        models: DbtSemanticModelDto[],
    ): CanonicalRelationship[] {

        const relationships: CanonicalRelationship[] = [];

        for (const model of models) {

            for (const entity of model.entities) {
                if (entity.type !== 'foreign') {
                    continue;
                }

                relationships.push({
                    sourceModel: model.name,
                    sourceEntity: entity.name,
                    targetModel: `${entity.name}s`,
                    targetEntity: entity.name,
                    relationshipType: 'many_to_one',
                });

            }

        }

        return relationships;

    }

}