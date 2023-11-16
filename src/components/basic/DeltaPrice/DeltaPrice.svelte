<script lang="ts">
  import { currencies } from 'data/currency';

  import { DeltaPriceSize, DeltaPriceStatus } from './constants';

  export let delta: {
    value: string | number;
    status: DeltaPriceStatus;
    percent: string | number;
  };
  export let size: DeltaPriceSize = DeltaPriceSize.SMALL;
  export let displayArrow: boolean = true;
  export let showCurrencySymbol: boolean = false;
  export let currency: string;

  $: symbol = currencies.find((c) => c.value === currency).label;

  const sizesClasses = {
    [DeltaPriceSize.SMALL]: {
      class: '',
      arrow: '',
    },
    [DeltaPriceSize.LARGE]: {
      class: 'font-size-14',
      arrow: 'font-size-17',
    },
  };

  const set = {
    [DeltaPriceStatus.NEGATIVE]: {
      class: 'badge-soft-danger',
      arrow: 'mdi-arrow-down-bold text-danger',
      symbol: '-',
    },
    [DeltaPriceStatus.NEUTRAL]: {
      class: 'badge-soft-secondary',
      arrow: '',
      symbol: '',
    },
    [DeltaPriceStatus.POSITIVE]: {
      class: 'badge-soft-success',
      arrow: 'mdi-arrow-up-bold text-success',
      symbol: '+',
    },
  };
</script>

<span
  class="mb-0 badge {set[delta.status].class} {sizesClasses[size].class} {$$props.class}">
  {set[delta.status].symbol}
  {showCurrencySymbol ? symbol : ''}{delta.value?.toLocaleString()} ({delta.percent} %)
</span>
{#if displayArrow}
  <i class="mdi ms-1 {set[delta.status].arrow} {sizesClasses[size].arrow}"></i>
{/if}
