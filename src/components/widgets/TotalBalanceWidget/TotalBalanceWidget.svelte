<script lang="ts">
  import { Card, CardBody, Row, Col, Spinner } from 'sveltestrap';
  import { _ } from 'svelte-i18n';
  import { createQuery } from '@tanstack/svelte-query';

  import Price from 'src/components/basic/Price/Price.svelte';
  import MiniChart from 'src/components/basic/MiniChart.svelte';
  import { currency, wallet } from 'src/stores';
  import { PriceSize } from 'src/components/basic/Price/constants';

  import { getTodayBalance, getHistoryBalance } from './service';

  $: todayBalance = createQuery({
    queryFn: () => getTodayBalance({ location: $wallet, currency: $currency }),
    queryKey: ['total-today-balance', { currency: $currency, location: $wallet }],
    keepPreviousData: true,
  });

  $: historyBalance = createQuery({
    queryFn: () => getHistoryBalance({ location: $wallet, currency: $currency }),
    queryKey: ['history-2week-balance', { currency: $currency, location: $wallet }],
    keepPreviousData: true,
  });
</script>

<Card class="widget-card">
  <CardBody>
    {#if $todayBalance.isLoading}
      <Row class="widget-loader">
        <Spinner />
      </Row>
    {:else if $todayBalance.isError && $todayBalance.error instanceof Error}
      <span>{$_('errors.error')} {$todayBalance.error.message}</span>
    {:else}
      <div class="d-flex overflow-hidden">
        <div class="grid-widget-container">
          <div class="grid-widget">
            <div class="chart-wrapper">
              <MiniChart
                class="pe-3"
                data="{$historyBalance.data}"
                currency="{$currency}" />
            </div>
          </div>
        </div>
        <div class="text-end flex-shrink-1">
          <p class="text-muted mb-4 right text-nowrap">
            {$_('widgets.totalBalanceTitle')}
          </p>
          <Price value="{$todayBalance.data.value}" currency="{$currency}" />
          <Price
            class="text-muted text-truncate mb-0"
            value="{$todayBalance.data.delta.value}"
            size="{PriceSize.SMALL}"
            currency="{$currency}"
            deltaType="{$todayBalance.data.delta.status}" />
        </div>
      </div>
    {/if}
  </CardBody>
</Card>

<style lang="scss">
  :global(.widget-card) {
    min-height: 130px;
    position: relative;
  }
  :global(.widget-loader) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(0, -50%);
  }
  .grid-widget-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;

    & .grid-widget {
      flex: 1;
      box-sizing: border-box;
      padding: 0;
      height: 100%;
      min-height: 0;
      width: 100%;
      overflow: auto;

      & .chart-wrapper {
        width: 100%;
        height: 100%;
        display: block;
        overflow: hidden;
      }
    }
  }
</style>
