<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { Container, Row, Col, Button } from 'sveltestrap';
  import { createQuery } from '@tanstack/svelte-query';
  import { assert, nullable } from 'superstruct';
  import Decimal from 'decimal.js';

  import { Api } from 'src/services/api';
  import PricingCard from 'src/components/widgets/Subscriptions/PricingCard.svelte';
  import DataLoader from 'src/components/helpers/DataLoader.svelte';
  import {
    SubscriptionsSchema,
    type SubscriptionPeriod,
    type SubscriptionPlan,
    type Subscriptions,
  } from 'src/components/widgets/Subscriptions/types';

  import subscriptionsLangs from './langs';

  const QUERY_PREFIX: string = 'SubscriptionsWidget';

  let selectedPeriod: SubscriptionPeriod;
  let prices: Record<string, Decimal>;

  $: getSubscriptionsQuery = createQuery({
    queryFn: () => getSubscriptions(),
    queryKey: [`${QUERY_PREFIX}.getSubscriptions`],
    keepPreviousData: true,
    retry: false,
  });

  const getSubscriptions = async () => {
    const data: Subscriptions = await Api.get('/subscriptions/getSubscriptions');
    assert(data, nullable(SubscriptionsSchema));
    selectedPeriod = data.periods[0];
    prices = data.prices as Record<string, Decimal>;
    return data;
  };

  $: getPrice = (plan: SubscriptionPlan): Decimal => {
    if (!selectedPeriod) {
      return new Decimal(0);
    }
    const key: string = `${selectedPeriod?.subscriptionPeriodId}_${plan.subscriptionPlanId}`;
    return prices[key] || new Decimal(0);
  };
</script>

<Container fluid>
  <Row class="justify-content-center">
    <Col lg="{6}">
      <div class="text-center mb-5">
        <h4>{$_('pages.subscriptions.choosePricingPlan')}</h4>
      </div>
    </Col>
  </Row>

  <DataLoader data="{getSubscriptionsQuery}" checkEmpty source="Subscriptions">
    <Container fluid slot="data">
      <Row>
        <Container sm class="py-3 text-center">
          {#each $getSubscriptionsQuery.data.periods as period}
            <Button
              class="mx-1"
              color="primary"
              outline
              active="{selectedPeriod?.name === period.name}"
              on:click="{() => (selectedPeriod = period)}">
              {$_(subscriptionsLangs.periods.names[period.name])}
            </Button>
          {/each}
        </Container>
      </Row>

      <Row>
        {#each $getSubscriptionsQuery.data.plans as plan}
          <PricingCard {plan} price="{getPrice(plan)}" />
        {/each}
      </Row>
    </Container>
  </DataLoader>
</Container>
