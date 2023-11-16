import { _ } from 'svelte-i18n';
import { get } from 'svelte/store';

import { addError } from '../stores/alerts';

import type { ApiError } from './api';

export const generalErrorHandler = (err: unknown) => {
  let message: string = get(_)('alerts.error.unknownError');
  if (typeof err === 'string') {
    message = err;
  } else if (err instanceof Error) {
    message = err.message;
  } else if (
    typeof err === 'object' &&
    (err as ApiError).errorCode &&
    (err as ApiError).errorMessage
  ) {
    return;
  }
  addError(message);
};
