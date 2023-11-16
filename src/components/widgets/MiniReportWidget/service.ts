import { assert } from 'superstruct';

import { Api } from 'src/services/api';
import { subtractDays } from 'src/services/datetime';

import { type ReportData, ReportSchema } from './types';

const times = [new Date(), subtractDays(1), subtractDays(7), subtractDays(30)];

export const getReport = async ({ location, currency }) => {
  const data: ReportData = await Api.get('/wallets-balance-history', {
    location,
    currency,
  });

  assert(data, ReportSchema);

  const { values } = data;

  const res = [];

  for (const [index, value] of values.entries()) {
    const item = {
      title: times[index],
      value: value.additional_value,
      delta: value.delta,
    };

    res.push(item);
  }

  return res;
};
