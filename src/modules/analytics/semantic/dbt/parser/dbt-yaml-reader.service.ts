import { Injectable, NotFoundException } from '@nestjs/common';
import { promises as fs } from 'fs';

@Injectable()
export class DbtYamlReaderService {
    /**
     * Reads a YAML file.
     */
    async read(
        file: string,
    ): Promise<string> {
        try {
            return await fs.readFile(file, 'utf8');
        } catch {
            throw new NotFoundException(
                `Unable to read '${file}'.`,
            );
        }
    }

    /**
     * Reads multiple YAML files.
     */
    async readMany(
        files: string[],
    ): Promise<Map<string, string>> {
        const documents = new Map<
            string,
            string
        >();

        for (const file of files) {
            documents.set(file, await this.read(file));
        }

        return documents;
    }
}