<script lang="ts">
  import { Container } from 'sveltestrap';

  import RuleCodeWidget from 'src/components/widgets/Rules/RuleCodeWidget.svelte';
  import RuleCardWidget from 'src/components/widgets/Rules/RuleCardWidget.svelte';
  import RulesWidget from 'src/components/widgets/Rules/RulesWidget.svelte';
  import PageContent from 'src/layouts/site/PageContent.svelte';
  import {
    RulesPageActions,
    type RulesPageParams,
  } from 'src/components/widgets/Rules/types';

  export let params: RulesPageParams = {};

  /**
   * Get page params from template /:id/:action
   * We can skip id and send only action (e.g 'create' action)
   */
  const getRulePageParams = () => {
    let { id, action } = params;
    if (!action && Object.values(RulesPageActions).includes(id as RulesPageActions)) {
      action = id as RulesPageActions;
      id = '0';
    }

    return { id, action };
  };

  /**
   * Check if action for code edit/view
   */
  const checkCodeAction = () => {
    const { action } = getRulePageParams();
    return (
      action &&
      (action === RulesPageActions.CODE_VIEW || action === RulesPageActions.CODE_EDIT)
    );
  };
</script>

<PageContent>
  <Container fluid slot="content">
    {#if params.id}
      {#if checkCodeAction()}
        <RuleCodeWidget ruleId="{+params.id}" />
      {:else}
        <RuleCardWidget ruleId="{+params.id}" />
      {/if}
    {:else}
      <RulesWidget />
    {/if}
  </Container>
</PageContent>
