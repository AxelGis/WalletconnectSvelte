<script lang="ts">
  import { Card, CardBody, Col, Row, Spinner } from 'sveltestrap';
  import { _, isLoading } from 'svelte-i18n';
  import { createQuery } from '@tanstack/svelte-query';

  import { getHistoryBalance } from '../TotalBalanceWidget/service';

  import {
    DeltaPriceSize,
    DeltaPriceStatus,
  } from 'src/components/basic/DeltaPrice/constants';
  import Dropdown from 'src/components/basic/Dropdown/Dropdown.svelte';
  import Price from 'src/components/basic/Price/Price.svelte';
  import DeltaPrice from 'src/components/basic/DeltaPrice/DeltaPrice.svelte';
  import MiniChart from 'src/components/basic/MiniChart.svelte';
  import { PriceSize } from 'src/components/basic/Price/constants';
  import { currency, wallet } from 'src/stores';

  import { getPPWalletBalance, getTodayBalance } from './service';

  const times = [
    { value: '24_hours_ago', label: $_('widgets.ppWalletBalance.dates.24HoursAgo') },
    { value: '1_week_ago', label: $_('widgets.ppWalletBalance.dates.1WeekAgo') },
    { value: '1_month_ago', label: $_('widgets.ppWalletBalance.dates.1MonthAgo') },
    {
      value: '3_month_ago',
      label: $_('widgets.ppWalletBalance.dates.3MonthAgo'),
      disabled: true,
    },
    {
      value: '6_month_ago',
      label: $_('widgets.ppWalletBalance.dates.6MonthAgo'),
      disabled: true,
    },
    {
      value: '12_month_ago',
      label: $_('widgets.ppWalletBalance.dates.12MonthAgo'),
      disabled: true,
    },
  ];

  let time = times[0].value;

  $: todayBalance = createQuery({
    queryFn: () =>
      getTodayBalance({ period: time, location: $wallet, currency: $currency }),
    queryKey: ['pp-today-balance', time, { location: $wallet, currency: $currency }],
    keepPreviousData: true,
  });

  $: historyBalance = createQuery({
    queryFn: () => getHistoryBalance({ location: $wallet, currency: $currency }),
    queryKey: ['history-2week-balance', time, { location: $wallet, currency: $currency }],
    keepPreviousData: true,
  });

  $: ppWalletBalance = createQuery({
    queryFn: () =>
      getPPWalletBalance({ period: time, location: $wallet, currency: $currency }),
    queryKey: ['pp-wallet-balance', time, { location: $wallet, currency: $currency }],
    keepPreviousData: true,
  });
</script>

<Card>
  <CardBody>
    <div class="float-end">
      <Dropdown class="ms-2" options="{times}" bind:value="{time}" />
    </div>

    <h4 class="card-title mb-3">{$_('widgets.ppWalletBalance.title')}</h4>
    <div class="mt-4 flex flex-wrap">
      {#if $todayBalance.data}
        <div class="d-block">
          <Price
            class="d-inline"
            currency="{$currency}"
            value="{$todayBalance.data.value}"
            size="{PriceSize.LARGE}" />
          <DeltaPrice
            size="{DeltaPriceSize.LARGE}"
            showCurrencySymbol="{true}"
            currency="{$currency}"
            delta="{{
              value: $todayBalance.data.delta,
              status:
                $todayBalance.data.delta > 0
                  ? DeltaPriceStatus.POSITIVE
                  : DeltaPriceStatus.NEGATIVE,
              percent: (
                (Math.abs($todayBalance.data.delta) / Number($todayBalance.data.value)) *
                100
              ).toFixed(2),
            }}" />
        </div>
      {/if}
      <Row class="mt-4 report-row">
        {#if $ppWalletBalance.isLoading}
          <Row class="widget-loader">
            <Spinner />
          </Row>
        {:else if $ppWalletBalance.isError && $ppWalletBalance.error instanceof Error}
          <span>{$_('errors.error')} {$ppWalletBalance.error.message}</span>
        {:else}
          {#each $ppWalletBalance.data?.values as balance}
            <Col xs="6" md="4">
              <div>
                <p class="mb-2">{balance.symbol}</p>
                <Price
                  value="{balance.additional_value}"
                  currency="{$currency}"
                  class="h4"
                  size="{PriceSize.SMALL}" />
                <h5 class="font-size-13 color-gray">
                  {balance.value}
                  {balance.symbol}
                </h5>
                <DeltaPrice
                  size="{DeltaPriceSize.SMALL}"
                  displayArrow="{false}"
                  showCurrencySymbol="{true}"
                  currency="{$currency}"
                  delta="{balance.delta}" />
              </div>
              <MiniChart currency="{$currency}" data="{$historyBalance.data}" />
            </Col>
          {/each}
        {/if}
      </Row>
    </div>
  </CardBody>
</Card>

<style lang="scss">
  :global(.report-row) {
    row-gap: 1.5rem;
  }
  .color-gray {
    color: gray;
  }
</style>
