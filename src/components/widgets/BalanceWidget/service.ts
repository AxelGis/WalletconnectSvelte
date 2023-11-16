import { assert } from 'superstruct';

import { Api } from 'src/services/api';
import { DeltaPriceStatus } from 'src/components/basic/DeltaPrice';

import { type ReportData, ReportSchema } from './types';

export const getPPWalletBalance = async ({ period, location, currency }) => {
  const data: ReportData = await Api.get('/wallets-balance-history/pp', {
    period,
    location,
    currency,
  });

  assert(data, ReportSchema);

  return data;
};

export const getTodayBalance = async ({ period, location, currency }) => {
  const data: ReportData = await Api.get('/wallets-balance-history/pp', {
    period,
    location,
    currency,
  });

  assert(data, ReportSchema);
  const summaryValue = data.values.reduce(
    (acc, value) => acc + Number(value.additional_value),
    0
  );
  let summaryDelta = 0;
  for (const value of data.values) {
    const { delta } = value;

    switch (delta.status) {
      case DeltaPriceStatus.POSITIVE:
        summaryDelta += delta.value;
        break;
      case DeltaPriceStatus.NEGATIVE:
        summaryDelta -= delta.value;
        break;
    }
  }

  return {
    value: summaryValue,
    delta: summaryDelta,
  };
};
