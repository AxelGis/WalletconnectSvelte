import { Infer, array, enums, number, object, string } from 'superstruct';

import { DeltaPriceStatus } from 'src/components/basic/DeltaPrice';

export const ReportSchema = object({
  network: string(),
  location: string(),
  additional_currency: string(),
  values: array(
    object({
      time: string(),
      symbol: string(),
      value: string(),
      additional_value: string(),
      delta: object({
        value: number(),
        status: enums(Object.values(DeltaPriceStatus)),
        percent: string(),
      }),
    })
  ),
});

export type ReportData = Infer<typeof ReportSchema>;
