import { BadRequestException, Injectable} from '@nestjs/common';
import { parse } from 'yaml';

@Injectable()
export class DbtDocumentParserService {

    parse(
        file: string,
        content: string,
    ): Record<string, unknown> {

        try {

            const document = parse(content);

            if (
                document === null ||
                typeof document !== 'object' ||
                Array.isArray(document)
            ) {
                throw new BadRequestException(
                    `Invalid YAML document in '${file}'.`,
                );
            }

            return document as Record<string, unknown>;

        } catch (error) {

            throw new BadRequestException(
                `Failed to parse '${file}': ${error instanceof Error ? error.message : 'Unknown error'}`,
            );

        }

    }

}