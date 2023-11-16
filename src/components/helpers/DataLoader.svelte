<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { Alert, Spinner } from 'sveltestrap';

  import type { CreateQueryResult } from '@tanstack/svelte-query';

  const isNotEmptyData = (data: unknown) => {
    if (data === null) {
      return false;
    }
    if (typeof data === 'string' && data === '') {
      return false;
    }

    if (Array.isArray(data) && data.length === 0) {
      return false;
    }

    return true;
  };

  export let data: CreateQueryResult;
  export let checkEmpty: boolean = false;
  export let source: string = '';
</script>

{#if $data.isLoading}
  <div class="spinner-center-box">
    <div class="spinner-center">
      <Spinner />
    </div>
  </div>
{:else if $data.isError}
  <Alert color="danger">
    <h5 class="alert-header">{source}</h5>
    <span>
      {#if $data.error instanceof Error}
        {$data.error.message}
      {:else}
        {$_('errors.componentError')}
      {/if}
    </span>
  </Alert>
{:else if checkEmpty && !isNotEmptyData($data.data)}
  <Alert color="warning">
    <h5 class="alert-header">{source}</h5>
    <span>{$_('errors.emptyData')}</span>
  </Alert>
{:else}
  <slot name="data" />
{/if}

<style lang="scss">
  .alert-header {
    color: var(--pp-color);
  }

  .spinner-center-box {
    position: relative;
    padding: 2rem;
  }
  .spinner-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(0, -50%);
  }
</style>
