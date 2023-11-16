<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { Col, Card, CardBody, Button, CardHeader, Badge } from 'sveltestrap';
  import Decimal from 'decimal.js';

  import subscriptionsLangs from './langs';

  import type { SubscriptionPlan } from 'src/components/widgets/Subscriptions/types';
  export let plan: SubscriptionPlan;
  export let price: Decimal;

  $: checkDiscount = () => {
    return !new Decimal(plan.basePrice).equals(price);
  };

  $: calculateDiscount = (): Decimal => {
    return new Decimal(plan.basePrice).sub(price);
  };
</script>

<Col xl="4" md="6" sm="12">
  <Card class="plan-box">
    <CardHeader>
      <div class="flex-grow-1 text-center plan-header">
        <h4>{$_(subscriptionsLangs.plans.names[plan.name])}</h4>
      </div>
    </CardHeader>
    <CardBody class="p-4">
      <div class="py-3">
        <h2 class="text-center">
          {price}
          <sup>
            <small>{plan.currency}</small>
          </sup>
        </h2>
        <div class="text-center">
          {$_('pages.subscriptions.pricingCard.perMonth')}
          {#if checkDiscount()}
            <Badge color="primary" class="badge-soft-primary">
              {$_('pages.subscriptions.pricingCard.discount', {
                values: {
                  currency: plan.currency,
                  discount: calculateDiscount().toString(),
                },
              })}
            </Badge>
          {/if}
        </div>
      </div>

      <div class="plan-features mt-3">
        {#each plan.features as feature}
          <p>
            <i class="bx bx-checkbox-square text-primary me-2"></i>
            <span>{$_(subscriptionsLangs.plans.features[feature])}</span>
          </p>
        {/each}
      </div>

      <div class="text-center">
        <Button color="primary" class="btn btn-primary btn-sm">
          {$_('pages.subscriptions.pricingCard.subscribe')}
        </Button>
      </div>
    </CardBody>
  </Card>
</Col>

<style lang="scss">
  .plan-header {
    padding-top: 0.5rem;
  }
</style>
