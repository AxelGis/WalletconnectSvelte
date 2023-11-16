import { Infer, array, number, object, string } from 'superstruct';

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
        status: string(),
        percent: string(),
      }),
    })
  ),
});

export type ReportData = Infer<typeof ReportSchema>;
