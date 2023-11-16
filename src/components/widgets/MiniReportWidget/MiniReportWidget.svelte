<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query';
  import { Card, CardBody, Col, Row, Spinner } from 'sveltestrap';
  import { _ } from 'svelte-i18n';

  import DeltaPrice from 'src/components/basic/DeltaPrice/DeltaPrice.svelte';
  import Price from 'src/components/basic/Price/Price.svelte';
  import { wallet, currency } from 'src/stores';
  import { __ } from 'src/stores/locale';
  import { durationInDaysWithToday } from 'src/services/datetime';

  import { getReport } from './service';

  $: queryKey = ['mini-ballance-report', { location: $wallet, currency: $currency }];
  const fn = () => getReport({ location: $wallet, currency: $currency });

  $: result = createQuery({
    queryFn: fn,
    queryKey: queryKey,
    keepPreviousData: true,
  });
</script>

<Card class="widget-card">
  <CardBody>
    {#if $result.isLoading}
      <Row class="widget-loader">
        <Spinner />
      </Row>
    {:else if $result.isError && $result.error instanceof Error}
      <span>{$_('errors.error')} {$result.error.message}</span>
    {:else}
      <Row class="report-row">
        {#each $result.data as report}
          <Col xs="6" xl="3">
            <div class="report-item">
              <p class="text-muted mb-sm-1 mb-xl-4">
                {$__(durationInDaysWithToday(report.title, true, true))}
              </p>
              <Price value="{report.value}" currency="{$currency}" />
              <DeltaPrice delta="{report.delta}" currency="{$currency}" />
            </div>
          </Col>
        {/each}
      </Row>
    {/if}
  </CardBody>
</Card>

<style lang="scss">
  :global(.report-row) {
    row-gap: 1.5rem;
  }
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
</style>
