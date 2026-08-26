import { Injectable, NotFoundException } from '@nestjs/common';
import { AnalyticsProjectContext } from '../contracts/project-context';

@Injectable()
export class ProjectContextService {

    async getContext(
        tenantId: string,
        projectId: string,
    ): Promise<AnalyticsProjectContext> {

        /*
         * Repository implementation will be connected
         * when persistence is added.
         *
         * For now this establishes the project-scoped
         * boundary used by the analytics pipeline.
         */

        throw new NotFoundException(
            `Analytics project '${projectId}' ` +
            `was not found for tenant '${tenantId}'.`,
        );
    }
}