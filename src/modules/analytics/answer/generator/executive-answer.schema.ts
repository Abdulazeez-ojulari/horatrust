export const executiveAnswerJsonSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
        summary: {
            type: 'string',
        },
        insights: {
            type: 'array',
            items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    type: {
                        type: 'string',
                        enum: [
                            'summary',
                            'trend',
                            'comparison',
                            'anomaly',
                            'breakdown',
                        ],
                    },
                    title: {
                        type: 'string',
                    },
                    description: {
                        type: 'string',
                    },
                    value: {
                        type: [
                            'number',
                            'null',
                        ],
                    },
                    previousValue: {
                        type: [
                            'number',
                            'null',
                        ],
                    },
                    absoluteChange: {
                        type: [
                            'number',
                            'null',
                        ],
                    },
                    percentageChange: {
                        type: [
                            'number',
                            'null',
                        ],
                    },
                    direction: {
                        type: [
                            'string',
                            'null',
                        ],

                        enum: [
                            'increase',
                            'decrease',
                            'unchanged',
                            null,
                        ],
                    },
                },
                required: [
                    'type',
                    'title',
                    'description',
                    'value',
                    'previousValue',
                    'absoluteChange',
                    'percentageChange',
                    'direction',
                ],
            },
        },
    },

    required: [
        'summary',
        'insights',
    ],
} as const;