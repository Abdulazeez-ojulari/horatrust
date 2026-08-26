import { z } from 'zod';

export const PlannerSchema = z.object({
    intent: z.string(),
    confidence: z.number().min(0).max(1),
    steps: z.array(
        z.object({
            action: z.enum([
                'fetch',
                'reason',
            ]),

            capability: z.string().optional(),
        }),
    ),
});

export type PlannerOutput = z.infer<
  typeof PlannerSchema
>;