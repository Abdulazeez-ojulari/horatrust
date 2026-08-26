import { Body, Controller, Post } from '@nestjs/common';
import { AnalyticsQueryService } from '../application/analytics-query.service';
import { AnalyticsQueryRequestDto } from '../application/dto/analytics-query.request.dto';

@Controller('analytics')
export class AnalyticsController {

    constructor(
        private readonly analyticsQueryService: AnalyticsQueryService,
    ) {}

    @Post('query')
    async query(
        @Body()
        request: AnalyticsQueryRequestDto,
    ) {

        return await this.analyticsQueryService.query(
            request.question,
            {
                llmProvider: request.llmProvider,
                semanticProvider: request.semanticProvider,
            },
        );
    }
}