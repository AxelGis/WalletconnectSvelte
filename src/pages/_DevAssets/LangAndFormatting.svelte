<script lang="ts">
  import { _, locale } from 'svelte-i18n';
  import { date, time } from 'svelte-i18n';
  import dayjs from 'dayjs';
  import { Card, CardBody, CardHeader, CardText, CardTitle } from 'sveltestrap';
  import { get } from 'svelte/store';

  import { __ } from 'src/stores/locale';
  import {
    durationInDays,
    dateOnly,
    timeMinutes,
    timeSeconds,
    dateTime,
    customFormat,
    durationUniversal,
    addDays,
    addHours,
    subtractDays,
    subtractHours,
    durationInDaysWithToday,
  } from 'src/services/datetime';

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  export let attributeWithHTML;
</script>

<strong>*Change language to see the difference</strong>
<br /><br />
<Card class="mb-3">
  <CardHeader>
    <CardTitle>Plurals with `svelte-i18n`:</CardTitle>
  </CardHeader>
  <CardBody>
    <CardText>
      <p>
        {$_('pages.devAssets.formatMessage.keyWithPlural', { values: { itemCount: 0 } })}
      </p>
      <p>
        {$_('pages.devAssets.formatMessage.keyWithPlural', { values: { itemCount: 1 } })}
      </p>
      <p>
        {$_('pages.devAssets.formatMessage.keyWithPlural', { values: { itemCount: 2 } })}
      </p>
      <p>
        {$_('pages.devAssets.formatMessage.keyWithPlural', { values: { itemCount: 5 } })}
      </p>
    </CardText>
  </CardBody>
</Card>
<Card class="mb-3">
  <CardHeader>
    <CardTitle>
      Recommended approach to format dates using `dayjs` (with reactivity):
    </CardTitle>
  </CardHeader>
  <CardBody>
    <CardText>
      <div>
        <h6 class="d-inline">function timeMinutes:</h6>
        <strong class="px-2">{$__(timeMinutes())}</strong> - current date
      </div>
      <div>
        <h6 class="d-inline">function timeSeconds:</h6>
        <strong class="px-2">{$__(timeSeconds())}</strong> - current date
      </div>
      <div>
        <h6 class="d-inline">function dateOnly:</h6>
        <strong class="px-2">{$__(dateOnly())}</strong> - current date
      </div>
      <div>
        <h6 class="d-inline">function dateTime:</h6>
        <strong class="px-2">{$__(dateTime())}</strong> - current date
      </div>
      <br />
      <h6>function durationInDays:</h6>
      <br />
      <p>
        {$__(durationInDays(addHours(1), false, true))} - standalone example when date is used
        separately (usually with capital letter but depends on language)
      </p>
      <p>
        {$_('pages.devAssets.datetime.keyWithDuration', {
          values: { duration: durationInDays(addHours(1), false, false) },
        })} - embedded example when date is used inside message (usually with lowercase)
      </p>
      <p>{$__(durationInDays(addHours(1), true, true))} - standalone</p>
      <p>{$__(durationInDays(addHours(1), true, false))} - embedded</p>
      <p>{$__(durationInDays(subtractHours(1), true, true))} - standalone</p>
      <p>{$__(durationInDays(subtractHours(1), true, false))} - embedded</p>
      <p>{$__(durationInDays(addDays(1)))}</p>
      <p>{$__(durationInDays(addDays(1), true))}</p>
      <p>{$__(durationInDays(subtractDays(1), true))}</p>
      <p>{$__(durationInDays(addDays(2)))}</p>
      <p>{$__(durationInDays(addDays(2), true))}</p>
      <p>{$__(durationInDays(subtractDays(2), true))}</p>
      <p>{$__(durationInDays(addDays(5)))}</p>
      <p>{$__(durationInDays(addDays(5), true))}</p>
      <p>{$__(durationInDays(subtractDays(5), true))}</p>
      <p>{$__(durationInDays(addDays(35)))}</p>
      <p>{$__(durationInDays(addDays(35), true))}</p>
      <p>{$__(durationInDays(subtractDays(35), true))}</p>

      <br />
      <h6>
        function durationInDaysWithToday (the same as durationInDays but with
        Today/Yesterday/Tomorrow):
      </h6>
      <br />
      <p>
        {$__(durationInDaysWithToday(addHours(1), false, true))} - standalone example when
        date is used separately (with capital letter)
      </p>
      <p>
        {$_('pages.devAssets.datetime.keyWithDurationAndSuffix', {
          values: { duration: durationInDaysWithToday(addHours(1), false, false) },
        })} - embedded example when date is used inside message (with lowercase)
      </p>
      <p>{$__(durationInDaysWithToday(addDays(1), true, true))} - standalone</p>
      <p>{$__(durationInDaysWithToday(addDays(1), true, false))} - embedded</p>
      <p>{$__(durationInDaysWithToday(subtractDays(1), true, true))} - standalone</p>
      <p>{$__(durationInDaysWithToday(subtractDays(1), true, false))} - embedded</p>

      <br />
      <h6>function durationUniversal:</h6>
      <br />
      <p>
        <strong>{$__(durationUniversal())}</strong> - no date is passed to the function
      </p>
      <p>
        <strong>{$__(durationUniversal(yesterday))}</strong> - `yesterday` is passed as Date
        object
      </p>
      <p>
        <strong>{$__(durationUniversal(subtractDays(1)))}</strong> - `yesterday` is passed
        as DayJs object
      </p>
      <p>
        <strong>{$__(durationUniversal(addDays(1)))}</strong> - `tomorrow` is passed as DayJs
        object
      </p>
      <p>
        <strong>{$__(durationUniversal(subtractDays(7), true))}</strong> - date happened 7
        days ago is passed, suffix is passed
      </p>
      <p>
        <strong>{$__(durationUniversal(subtractDays(7)))}</strong> - date happened 7 days ago
        is passed, suffix is NOT passed
      </p>
      <p>
        <strong>{$__(durationUniversal(subtractDays(30), true))}</strong> - date happened 30
        days ago is passed, suffix is passed
      </p>
      <p>
        <strong>{$__(durationUniversal(subtractDays(30)))}</strong> - date happened 30 days
        ago is passed, suffix is NOT passed
      </p>
    </CardText>
  </CardBody>
</Card>
<Card class="mb-3">
  <CardHeader>
    <CardTitle>Examples of `dayjs` library:</CardTitle>
  </CardHeader>
  <CardBody>
    <CardText>
      <p>
        {$_('pages.devAssets.datetime.keyWithDuration', {
          values: { duration: durationUniversal(subtractDays(2)) },
        })} - a duration injected to a message
      </p>
      <p>
        {$_('pages.devAssets.datetime.keyWithDurationAndSuffix', {
          values: { duration: durationUniversal(subtractDays(2), true) },
        })} - a duration with a suffix injected to a message
      </p>
      <p>
        <strong
          >{$_('pages.devAssets.formatMessage.reactivity', {
            values: { variable: dayjs.locale() },
          })}</strong>
        - selected locale for <strong>dayjs</strong>
      </p>
      <p>
        <strong
          >{$_('pages.devAssets.formatMessage.reactivity', {
            values: { variable: dayjs().format('L LT') },
          })}</strong> - reactive usage of `svelte-i18n` with "variable"
      </p>
      <p>
        <strong>{dayjs().locale('en').format('L LT')}</strong> - Locale 'en' is set and is
        not reactive (see code)
      </p>
      <p>
        <strong>{dayjs().locale('ru').format('L LT')}</strong> - Locale 'ru' is set and is
        not reactive (see code)
      </p>
      <p>
        <strong>{$__(customFormat(new Date()))}</strong> - custom format but it's not localized
      </p>
    </CardText>
  </CardBody>
</Card>
<Card class="mb-3">
  <CardHeader>
    <CardTitle>Examples of messages with HTML and variables:</CardTitle>
  </CardHeader>
  <CardBody>
    <CardText>
      <!-- eslint-disable svelte/no-at-html-tags-->
      <p>{attributeWithHTML} - component attribute inserted as text</p>
      <p>
        {@html attributeWithHTML} - component attribute inserted as HTML. Possible XSS! Do
        not use!
      </p>
      <!-- eslint-enable -->
      <p>
        {$_('pages.devAssets.formatMessage.keyWithVariables', {
          values: { variable1: 'svelte-i18n', variable2: 'NestJS' },
        })} - a message with variables
      </p>
    </CardText>
  </CardBody>
</Card>
<Card class="mb-3">
  <CardHeader>
    <CardTitle>
      Not recommended but possible to format dates using `svelte-i18n`:
    </CardTitle>
  </CardHeader>
  <CardBody>
    <CardText>
      <p>
        <strong>{$date(today, { format: 'short', locale: get(locale) })}</strong> - short format
      </p>
      <p>
        <strong>{$date(today, { format: 'medium', locale: get(locale) })}</strong> - medium
        format
      </p>
      <p>
        <strong>{$date(today, { format: 'long', locale: get(locale) })}</strong> - long format
      </p>
      <p>
        <strong>{$date(today, { format: 'full', locale: get(locale) })}</strong> - full format
      </p>
    </CardText>
  </CardBody>
</Card>
<Card class="mb-3">
  <CardHeader>
    <CardTitle>
      Not recommended but possible to format times with `svelte-i18n`:
    </CardTitle>
  </CardHeader>
  <CardBody>
    <CardText>
      <p>
        <strong>{$time(today, { format: 'short', locale: get(locale) })}</strong> - short format
      </p>
      <p>
        <strong>{$time(today, { format: 'medium', locale: get(locale) })}</strong> - medium
        format
      </p>
      <p>
        <strong>{$time(today, { format: 'long', locale: get(locale) })}</strong> - long format
      </p>
      <p>
        <strong>{$time(today, { format: 'full', locale: get(locale) })}</strong> - full format
      </p>
    </CardText>
  </CardBody>
</Card>
