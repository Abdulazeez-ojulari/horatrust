export const semanticQueryJsonSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
        metrics: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
        dimensions: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
        filters: {
            type: 'array',
            items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    field: {
                        type: 'string',
                    },
                    operator: {
                        type: 'string',
                        enum: [
                            'eq',
                            'neq',
                            'gt',
                            'gte',
                            'lt',
                            'lte',
                            'in',
                            'not_in',
                            'contains',
                            'starts_with',
                            'ends_with',
                            'is_null',
                            'is_not_null',
                        ],
                    },
                    value: {
                        type: [
                            'string',
                            'number',
                            'boolean',
                            'array',
                            'null',
                        ],
                    },
                },
                required: [
                    'field',
                    'operator',
                    'value',
                ],
            },
        },

        orderBy: {
            type: 'array',

            items: {
                type: 'object',

                additionalProperties: false,

                properties: {

                    field: {
                        type: 'string',
                    },

                    direction: {
                        type: 'string',

                        enum: [
                            'asc',
                            'desc',
                        ],
                    },
                },

                required: [
                    'field',
                    'direction',
                ],
            },
        },

        limit: {
            type: [
                'integer',
                'null',
            ],
        },

        offset: {
            type: [
                'integer',
                'null',
            ],
        },

        timeRange: {
            type: [
                'object',
                'null',
            ],

            additionalProperties: false,

            properties: {

                dimension: {
                    type: 'string',
                },

                start: {
                    type: [
                        'string',
                        'null',
                    ],
                },

                end: {
                    type: [
                        'string',
                        'null',
                    ],
                },
            },

            required: [
                'dimension',
                'start',
                'end',
            ],
        },
    },

    required: [
        'metrics',
        'dimensions',
        'filters',
        'orderBy',
        'limit',
        'offset',
        'timeRange',
    ],
} as const;