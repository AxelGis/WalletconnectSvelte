import { get, writable } from 'svelte/store';

import type { ApiErrorResponse } from '../services/api';

const ALERT_LIFETIME: number = import.meta.env.VITE_ALERT_LIFETIME || 5000;

export enum AlertType {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'danger',
}

export type AlertInfo = {
  response?: ApiErrorResponse;
  duration?: number;
  url?: string;
  method?: string;
};

export type Alerts = {
  id?: number;
  message: string;
  type: AlertType;
  info?: AlertInfo;
};

let nextId: number = 1;
export const alerts = writable<Alerts[]>([]);

export const addAlert = (alert: Alerts) => {
  const newId: number = nextId++;
  alerts.set([{ ...alert, id: newId }, ...get(alerts)]);

  setTimeout(() => alerts.set(get(alerts).filter((a) => a.id !== newId)), ALERT_LIFETIME);
};

export const addError = (message: string) => {
  addAlert({ message, type: AlertType.ERROR });
};

export const addWarning = (message: string) => {
  addAlert({ message, type: AlertType.WARNING });
};

export const addSuccess = (message: string) => {
  addAlert({ message, type: AlertType.SUCCESS });
};
