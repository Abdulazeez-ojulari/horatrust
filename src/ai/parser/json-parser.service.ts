import { BadRequestException, Injectable } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class JsonParserService {
    parse<T>(content: string, schema: ZodSchema<T>): T {
        let cleaned = content.trim();

        // Remove markdown code fences
        cleaned = cleaned.replace(/^```json/i, '');
        cleaned = cleaned.replace(/^```/i, '');
        cleaned = cleaned.replace(/```$/i, '');
        cleaned = cleaned.trim();

        try {
            const parsed = JSON.parse(cleaned);

            return schema.parse(parsed);
        } catch (error) {
            throw new BadRequestException({
                message: 'Invalid JSON returned from LLM',
                raw: cleaned,
            });
        }
    }
}