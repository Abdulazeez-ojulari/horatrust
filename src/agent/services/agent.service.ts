import { Injectable } from '@nestjs/common';

import { PlannerService } from './planner.service';
import { ToolExecutorService } from './tool-executor.service';
import { ReasoningService } from './reasoning.service';

@Injectable()
export class AgentService {
    constructor(
        private readonly plannerService: PlannerService,
        private readonly toolExecutorService: ToolExecutorService,
        private readonly reasoningService: ReasoningService,
    ) {}

    async analyze(question: string) {
        const plan = await this.plannerService.plan(question);

        const capabilities = plan.steps
            .filter((step) => step.action === 'fetch')
            .map((step) => step.capability!)
            .filter(Boolean);

        const toolResults = await this.toolExecutorService.execute(capabilities);
        const analysis = await this.reasoningService.analyze(question, toolResults);

        return {
            success: true,
            data: {
                plan,
                toolResults,
                analysis,
            },
        };
    }
}