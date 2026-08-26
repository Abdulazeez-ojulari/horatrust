import { Injectable } from '@nestjs/common';
import { DbtDimensionDto, DbtDimensionType } from '../dto';
import { CanonicalDimension } from '../../contracts/canonical/canonical-dimension';

@Injectable()
export class DimensionMapper {

    map(
        dimension: DbtDimensionDto,
    ): CanonicalDimension {

        return {
            name: dimension.name,
            description: dimension.description,
            expression: dimension.expr,
            type: this.mapType(
                dimension.type,
            ),
            typeParams: { 
                timeGranularity: dimension.type_params?.time_granularity
            }
        };

    }

    mapMany(
        dimensions: DbtDimensionDto[],
    ): CanonicalDimension[] {

        return dimensions.map(dimension => this.map(dimension));

    }

    private mapType(
        type: DbtDimensionType,
    ): CanonicalDimension['type'] {

        switch (type) {

            case DbtDimensionType.TIME:
                return 'time';

            case DbtDimensionType.CATEGORICAL:
                return 'categorical';

            default:
                return 'categorical';

        }

    }

}