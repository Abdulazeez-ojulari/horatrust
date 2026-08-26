import { Injectable } from '@nestjs/common';
import { DbtSavedQueryDto } from '../dto';
import { CanonicalSavedQuery } from '../../contracts/canonical/canonical-saved-query';

@Injectable()
export class SavedQueryMapper {

    map(
        query: DbtSavedQueryDto,
    ): CanonicalSavedQuery {

        return {
            name: query.name,
            description: query.description,
            metrics: query.metrics,
            dimensions: query.dimensions ?? [],
            where: query.where,
            exports: query.exports ?? [],
            metadata: query.meta,
        };

    }

    mapMany(
        queries: DbtSavedQueryDto[],
    ): CanonicalSavedQuery[] {

        return queries.map(
            query => this.map(query),
        );

    }

}