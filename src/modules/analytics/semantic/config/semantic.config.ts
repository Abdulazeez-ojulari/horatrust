import { registerAs } from '@nestjs/config';
import { SemanticProviderType } from '../contracts/semantic-provider.enum';

export default registerAs(
    'semantic',
    () => ({
        provider: process.env.SEMANTIC_PROVIDER as SemanticProviderType ?? SemanticProviderType.DBT
    }),

);