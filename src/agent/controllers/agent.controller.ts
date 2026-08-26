import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
} from '@nestjs/common';

import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AgentService } from '../services/agent.service';
import { AnalyzeQuestionDto } from '../dto/analyze-question.dto';

@ApiTags('Agent')
@Controller('agent')
export class AgentController {
    constructor(
        private readonly agentService: AgentService,
    ) {}

    @Post('analyze')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary:
        'Analyze a business question and generate an execution plan',
    })
    @ApiBody({
        type: AnalyzeQuestionDto,
    })
    @ApiResponse({
        status: 200,
        description: 'Execution plan generated successfully.',
    })
    async analyze(
        @Body() dto: AnalyzeQuestionDto,
    ) {
        return this.agentService.analyze(dto.question);
    }
}