import { assert } from 'superstruct';

import { Api } from 'src/services/api';

import { type ReportData, ReportSchema } from './types';

export const getTodayBalance = async ({ location, currency }) => {
  const data = await Api.get('/wallets-balance-history', { location, currency });

  assert(data, ReportSchema);

  const { values } = data;

  const res = [];

  for (const value of values) {
    const item = {
      value: value.additional_value,
      delta: value.delta,
    };

    res.push(item);

    break;
  }

  return res[0];
};

export const getHistoryBalance = async ({ location, currency }) => {
  // While there is no datahub, I added a period, in the future a date range will be passed here to get the result.
  // I didn't do it now because of the complexity of implementation on back and lack of wrappers over day.js
  const data = await Api.get('/wallets-balance-history', {
    location,
    currency,
    period: '14_days',
  });

  assert(data, ReportSchema);

  const { values } = data;

  const res = [];

  for (const value of values) {
    res.unshift(value.additional_value);
  }

  return res;
};
