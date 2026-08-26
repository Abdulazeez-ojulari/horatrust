import { Tenant } from '../../../tenant/contracts/tenant';
import { AnalyticsProject } from './analytics-project';

export interface AnalyticsProjectContext {

    readonly tenant: Tenant;

    readonly project: AnalyticsProject;
}