import { Injectable } from '@nestjs/common';
import { DbtEntityDto, DbtEntityType } from '../dto';
import { CanonicalEntity } from '../../contracts/canonical/canonical-entity';

@Injectable()
export class EntityMapper {

    map(
        entity: DbtEntityDto,
    ): CanonicalEntity {

        return {
            name: entity.name,
            description: entity.description,
            type: this.mapType(entity.type),
            expression: entity.expr,
        };

    }

    mapMany(
        entities: DbtEntityDto[],
    ): CanonicalEntity[] {

        return entities.map(entity => this.map(entity));

    }

    private mapType(
        type: DbtEntityType,
    ): CanonicalEntity['type'] {

        switch (type) {

            case DbtEntityType.PRIMARY:
                return 'primary';

            case DbtEntityType.UNIQUE:
                return 'unique';

            case DbtEntityType.NATURAL:
                return 'natural';

            case DbtEntityType.FOREIGN:
                return 'foreign';

            default:
                return 'foreign';

        }

    }

}