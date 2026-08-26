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

import { AIService } from '../services/ai.service';
import { ChatDto } from '../dto/chat.dto';

@ApiTags('AI')
@Controller('ai')
export class AIController {
    constructor(
        private readonly aiService: AIService,
    ) {}

    @Post('chat')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Chat with the configured LLM',
    })
    @ApiBody({
        type: ChatDto,
    })
    @ApiResponse({
        status: 200,
        description: 'LLM response',
    })
    async chat(
        @Body() dto: ChatDto,
    ) {
        return this.aiService.chat(dto.prompt);
    }
}