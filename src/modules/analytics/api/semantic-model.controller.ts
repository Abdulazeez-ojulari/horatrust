import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Query,
} from '@nestjs/common';
import { SemanticModelService } from '../application/semantic-model.service';
import { LoadSemanticModelRequestDto } from '../application/dto/load-semantic-model.request.dto';
import { SemanticProviderType } from '../semantic/contracts';

@Controller('analytics/semantic-model')
export class SemanticModelController {

    constructor(
        private readonly semanticModelService: SemanticModelService,
    ) {}

    @Post('load')
    async load(
        @Body()
        request: LoadSemanticModelRequestDto,
        @Query('provider')
        provider?: SemanticProviderType,
    ) {
        return this.semanticModelService.load(
            request.projectRoot,
            provider ?? SemanticProviderType.DBT,
        );
    }

    @Post('reload')
    async reload(
        @Body()
        request: LoadSemanticModelRequestDto,
        @Query('provider')
        provider?: SemanticProviderType,
    ) {
        return this.semanticModelService.reload(
            request.projectRoot,
            provider ?? SemanticProviderType.DBT,
        );
    }

    @Get('status')
    status(
        @Query('provider')
        provider?: SemanticProviderType,
    ) {
        return this.semanticModelService.status(
            provider ?? SemanticProviderType.DBT,
        );
    }

    @Delete()
    clear(
        @Query('provider')
        provider?: SemanticProviderType,
    ) {
        this.semanticModelService.clear(
            provider ?? SemanticProviderType.DBT,
        );

        return {
            success: true,
        };
    }
}