<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query';
  import { _ } from 'svelte-i18n';
  import {
    Button,
    Card,
    CardBody,
    CardTitle,
    Col,
    FormGroup,
    Label,
    Row,
  } from 'sveltestrap';
  import { link, push } from 'svelte-spa-router';

  import { Api } from 'src/services/api';
  import DataLoader from 'src/components/helpers/DataLoader.svelte';
  import MonacoEditor from 'src/components/widgets/MonacoEditor/MonacoEditor.svelte';

  const QUERY_PREFIX: string = 'RulesWidget';
  const PAGE_URL: string = '/rules';

  export let ruleId: number;

  let ruleCode: string;

  $: getRuleCodeQuery = createQuery({
    queryFn: () => getRuleCode(),
    queryKey: [`${QUERY_PREFIX}.getRuleCode`],
    keepPreviousData: false,
    retry: false,
  });

  /**
   * Get rule code by prop ruleId
   */
  const getRuleCode = async () => {
    if (!ruleId) {
      return null;
    }

    const data: string = await Api.get(`/rules/getRuleCode/${ruleId}`);
    //assert(data, nullable(SubscriptionsSchema));
    ruleCode = data || null;
    return ruleCode;
  };

  /**
   * Save rule code
   */
  const saveRuleCode = async () => {
    const result: number = await Api.post(`/rules/saveRuleCode/${ruleId}`, {
      code: ruleCode,
    });

    if (result) {
      push(PAGE_URL);
    }
  };
</script>

<MonacoEditor />

<!-- <DataLoader data="{getRuleCodeQuery}" source="Rule">
  <Row slot="data">
    <Col lg="12">
      <Card>
        <CardBody>
          <CardTitle class="mb-4">Edit Rule Code</CardTitle>
          <form class="outer-repeater">
            <div data-repeater-list="outer-group" class="outer">
              <div data-repeater-item class="outer">
                <FormGroup class="mb-4" row>
                  <Label class="col-form-label col-lg-2">Rule Code</Label>
                  <Col lg="10"></Col>
                </FormGroup>
              </div>
            </div>
          </form>
          <Row class="justify-content-end">
            <Col lg="10">
              <Button color="primary" on:click="{saveRuleCode}">Save</Button>
              <a href="{PAGE_URL}" use:link class="btn btn-secondary">Cancel</a>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  </Row>
</DataLoader> -->
