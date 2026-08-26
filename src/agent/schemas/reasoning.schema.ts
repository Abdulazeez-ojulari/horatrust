import { z } from 'zod';

export const ReasoningSchema = z.object({
    summary: z.string(),
    keyFindings: z.array(
        z.string(),
    ),
    risks: z.array(
        z.string(),
    ),
    recommendations: z.array(
        z.string(),
    ),
});

export type ReasoningOutput = z.infer<typeof ReasoningSchema>;