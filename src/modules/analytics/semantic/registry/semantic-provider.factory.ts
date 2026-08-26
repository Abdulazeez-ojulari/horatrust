import { FactoryProvider } from '@nestjs/common';
import { SEMANTIC_PROVIDERS } from '../common/semantic.constants';
// import { PowerBiSemanticProvider } from '../powerbi/provider/powerbi.provider';
import { DbtSemanticProvider } from '../dbt/provider/dbt-semantic.provider';

export const SemanticProviderFactory:
FactoryProvider = {

    provide: SEMANTIC_PROVIDERS,

    inject: [
        DbtSemanticProvider,
        // PowerBiSemanticProvider,
    ],

    useFactory: (
        dbt: DbtSemanticProvider,
        // powerbi: PowerBiSemanticProvider,
    ) => [
        dbt,
        // powerbi,
    ],

};