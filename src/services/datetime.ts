import dayjs, { Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import isYesterday from 'dayjs/plugin/isYesterday';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { _, getMessageFormatter } from 'svelte-i18n';
import { get } from 'svelte/store';

import dayjsLocales from '../../data/dayjsLocales';

import { getCurrentLocale } from 'src/services/i18n';
import { dayjsLocale } from 'src/stores/locale';

export function initDayjsPlugins() {
  dayjs.extend(localizedFormat);
  dayjs.extend(isToday);
  dayjs.extend(isTomorrow);
  dayjs.extend(isYesterday);
  dayjs.extend(duration);
  dayjs.extend(relativeTime);
}

/**
 * Use dynamic imports to load DayJS locale and sets `en` locale with error message if no locale is found in DayJS list
 *
 * @param lang
 */
export default async function setDayjsSelectedLocale(lang) {
  if (dayjsLocales[lang]) {
    await dayjsLocales[lang]();
    dayjs.locale(lang);
    dayjsLocale.set(lang);
  } else {
    dayjs.locale('en');
    dayjsLocale.set('en');
    console.error('This locale is not in the list of "dayjsLocales" for DayJS library!');
  }
}
function useFormat(format: string, date?: Date | Dayjs) {
  const day: Dayjs = date ? dayjs(date) : dayjs();
  return day.format(format);
}
export function timeMinutes(date?: Date | Dayjs) {
  return useFormat('LT', date);
}
export function timeSeconds(date?: Date | Dayjs) {
  return useFormat('LTS', date);
}
export function dateTime(date?: Date | Dayjs) {
  return useFormat('lll', date);
}
export function dateOnly(date?: Date | Dayjs) {
  return useFormat('LL', date);
}
export function customFormat(date?: Date | Dayjs) {
  return useFormat('MMMM D', date);
}
/**
 * Returns messages such as "today", "yesterday", "tomorrow", "two days ago", "a month ago"
 * according to Breakdown ranges set in a locale https://day.js.org/docs/en/display/from-now
 * @param date
 * @param suffix: if false, `humanize` returns messages such as `a minute`. If `true`, humanize adds a suffix in the following way:
 * `in a minute` or `a minute ago`.
 */
export function durationUniversal(date?: Date | Dayjs, suffix?: boolean): string {
  const day: Dayjs = date ? dayjs(date) : dayjs();

  if (day.isToday()) {
    return get(_)('datetime.todayEmbedded');
  }
  if (day.isYesterday()) {
    return get(_)('datetime.yesterdayEmbedded');
  }
  if (day.isTomorrow()) {
    return get(_)('datetime.tomorrowEmbedded');
  }
  const diff = day.diff(dayjs());
  return dayjs.duration(diff).humanize(suffix);
}

/**
 * Returns messages in days. For example, if the date passed is 30 days ago, it will return `30 days`, not `a month`.
 * It's meant under embedded/standalone that date phrase is inside some message or standalone. Usually lowercase/uppercase letters
 * to be used in localized messages but it depends on language.
 * One didn't manage to find the way how to return strict number of days with dayJS means. So localization messages have been used.
 * @param date
 * @param suffix: if false, `humanize` returns messages such as `5 days`. If `true`, `humanize` adds a suffix in the following way:
 * `in 5 days` or `5 days ago`.
 * @param isStandalone: if false, language keys for date phrases inside messages should be applied. Usually lowercase.
 * For example, `it will take 2 days`.
 * If true, language keys for standalone date phrases should be applied, usually uppercase. For example, `2 days` or `2 days ago`.
 */
export function durationInDays(
  date?: Date | Dayjs,
  suffix?: boolean,
  isStandalone?: boolean
): string {
  const day: Dayjs = date ? dayjs(date) : dayjs();
  const diff = dayjs().diff(day, 'd');
  const diffInMillisec = dayjs().diff(day);

  let message;
  if (suffix) {
    if (diffInMillisec >= 0) {
      message = get(_)(
        isStandalone ? 'datetime.daysInPastStandalone' : 'datetime.daysInPastEmbedded'
      );
    } else {
      message = get(_)(
        isStandalone ? 'datetime.daysInFutureStandalone' : 'datetime.daysInFutureEmbedded'
      );
    }
  } else {
    message = get(_)(
      isStandalone ? 'datetime.daysPluralStandalone' : 'datetime.daysPluralEmbedded'
    );
  }
  const messageFormatted = getMessageFormatter(message, getCurrentLocale()).format({
    n: Math.abs(diff),
  });

  return messageFormatted as string;
}

/**
 * Similar to `durationInDays` but also returns Today, Yesterday or Tomorrow labels for corresponding dates
 * @param date
 * @param suffix
 * @param isStandalone
 */
export function durationInDaysWithToday(
  date?: Date | Dayjs,
  suffix?: boolean,
  isStandalone?: boolean
): string {
  const day: Dayjs = date ? dayjs(date) : dayjs();

  if (day.isToday()) {
    return get(_)(isStandalone ? 'datetime.todayStandalone' : 'datetime.todayEmbedded');
  }
  if (day.isYesterday()) {
    return get(_)(
      isStandalone ? 'datetime.yesterdayStandalone' : 'datetime.yesterdayEmbedded'
    );
  }
  if (day.isTomorrow()) {
    return get(_)(
      isStandalone ? 'datetime.tomorrowStandalone' : 'datetime.tomorrowEmbedded'
    );
  }

  return durationInDays(day, suffix, isStandalone);
}

export function addDays(n: number): Dayjs {
  return dayjs().add(n, 'd');
}
export function subtractDays(n: number): Dayjs {
  return dayjs().subtract(n, 'd');
}
export function addHours(n: number): Dayjs {
  return dayjs().add(n, 'h');
}
export function subtractHours(n: number): Dayjs {
  return dayjs().subtract(n, 'h');
}
