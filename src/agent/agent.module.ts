import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { AgentController } from './controllers/agent.controller';

import { AgentService } from './services/agent.service';
import { PlannerService } from './services/planner.service';
import { ToolRegistryService } from './services/tool-registry.service';
import { ToolExecutorService } from './services/tool-executor.service';
import { ReasoningService } from './services/reasoning.service';
import { SemanticApiService } from './services/semantic-api.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    AiModule,
    HttpModule,
  ],

  controllers: [AgentController],

  providers: [
    AgentService,
    PlannerService,
    ToolRegistryService,
    ToolExecutorService,
    ReasoningService,
    SemanticApiService,
  ],

  exports: [
    AgentService,
    // PlannerService,
    // ToolRegistryService,
    // ToolExecutorService,
    // ReasoningService,
  ],
})
export class AgentModule {}