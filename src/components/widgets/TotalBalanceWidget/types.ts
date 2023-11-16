import { Infer, array, number, object, optional, string } from 'superstruct';

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
      delta: optional(
        object({
          value: number(),
          status: string(),
          percent: string(),
        })
      ),
    })
  ),
});

export type ReportData = Infer<typeof ReportSchema>;
