export const CAPABILITIES = [
  'revenue',
  'orders',
  'expenses',
  'customers',
  'customer_churn',
  'profit',
  'cash_flow',
  'burn_rate',
  'inventory',
  'marketing_spend',
  'subscriptions',
  'employees',
  'growth_rate',
  'active_users',
  'new_customers',
  'retention_rate',
] as const;

export type Capability = (typeof CAPABILITIES)[number];