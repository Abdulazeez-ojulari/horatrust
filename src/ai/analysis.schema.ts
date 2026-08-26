import { z } from 'zod';

export const QuestionAnalysisSchema = z.object({
    intent: z.enum([
        'root_cause_analysis',
        'trend_analysis',
        'forecast',
        'comparison',
        'summary',
        'ranking',
    ]),

    analysis_type: z.string(),

    required_capabilities: z.array(z.string()),

    time_range: z.object({
        current: z.string().nullable(),
        compare_with: z.string().nullable(),
    }),

    confidence: z.number(),
});

export type QuestionAnalysis = z.infer<typeof QuestionAnalysisSchema>;