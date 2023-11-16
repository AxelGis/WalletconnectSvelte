import { Infer, array, number, object, string } from 'superstruct';

import { DecimalStruct } from 'src/types/decimal';

export const SubscriptionPeriodSchema = object({
  subscriptionPeriodId: number(),
  name: string(),
  freeMonths: number(),
});

export const SubscriptionPlanSchema = object({
  subscriptionPlanId: number(),
  name: string(),
  basePrice: DecimalStruct,
  currency: string(),
  features: array(string()),
});

export const SubscriptionsSchema = object({
  periods: array(SubscriptionPeriodSchema),
  plans: array(SubscriptionPlanSchema),
  prices: object(),
});

export type SubscriptionPeriod = Infer<typeof SubscriptionPeriodSchema>;
export type SubscriptionPlan = Infer<typeof SubscriptionPlanSchema>;
export type Subscriptions = Infer<typeof SubscriptionsSchema>;
