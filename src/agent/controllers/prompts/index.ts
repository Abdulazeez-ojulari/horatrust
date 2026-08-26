import { PromptType } from './prompt.types';
import { systemPrompt } from './system.prompt';
import { plannerPrompt } from './planner.prompt';
import { reasoningPrompt } from './reasoning.prompt';
import { reportPrompt } from './report.prompt';

export const PROMPTS: Record<PromptType, string> = {
  [PromptType.SYSTEM]: systemPrompt,
  [PromptType.PLANNER]: plannerPrompt,
  [PromptType.REASONING]: reasoningPrompt,
  [PromptType.REPORT]: reportPrompt,
};