<script lang="ts">
  import { Button } from 'sveltestrap';

  export let containerClass = 'text-center';
  export let label = 'Button';
</script>

<div class="{containerClass}">
  <Button type="button" {...$$restProps}>
    {label}
  </Button>
</div>
