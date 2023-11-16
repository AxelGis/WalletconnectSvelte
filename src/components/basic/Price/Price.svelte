<script lang="ts">
  import { DeltaPriceStatus } from '../DeltaPrice';

  import { currencies } from 'data/currency';

  import { PriceSize } from './constants';

  export let value: string | number;
  export let size: PriceSize = PriceSize.MEDIUM;
  export let deltaType: DeltaPriceStatus = null;
  export let currency: string;

  $: if (typeof value === 'string') {
    value = parseInt(value, 10);
  }
  // TODO: в дальнейшем необходимо передавать актуальную локаль
  $: strValue = value.toLocaleString('en-US');

  $: symbol = currencies.find((c) => c.value === currency)?.label;
  $: deltaSymbol = deltaType ? (deltaType === DeltaPriceStatus.POSITIVE ? '+' : '-') : '';
</script>

<div
  class:h5="{size === PriceSize.MEDIUM}"
  class:h2="{size === PriceSize.LARGE}"
  class="{$$props.class}">
  {deltaSymbol}
  {symbol}
  {strValue}
</div>
