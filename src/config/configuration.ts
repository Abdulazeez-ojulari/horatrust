export default () => ({
    app: {
        name: 'InsightOS',
        port: parseInt(process.env.PORT ?? '3000', 10),
        nodeEnv: process.env.NODE_ENV ?? 'development',
    },

    database: {
        url: process.env.DATABASE_URL,
    },

    ollama: {
        url: process.env.OLLAMA_URL,
        model: process.env.OLLAMA_MODEL,
    },

    semanticApi: {
        baseUrl: process.env.SEMANTIC_API_URL,
        apiKey: process.env.SEMANTIC_API_KEY,
        timeout: parseInt(
            process.env.SEMANTIC_API_TIMEOUT ?? '30000',
            10,
        ),
    },
});