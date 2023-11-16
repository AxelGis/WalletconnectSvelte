import Decimal from 'decimal.js';
import { define } from 'superstruct';

export const DecimalStruct = define<Decimal | string>(
  'DecimalStruct',
  (val: Decimal | string) => !new Decimal(val).isNaN()
);
