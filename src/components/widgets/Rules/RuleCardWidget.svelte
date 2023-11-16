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
    Input,
    Label,
    Row,
  } from 'sveltestrap';
  import { link, push } from 'svelte-spa-router';

  import { Api } from 'src/services/api';
  import DataLoader from 'src/components/helpers/DataLoader.svelte';

  import type { Rule } from 'src/components/widgets/Rules/types';

  const QUERY_PREFIX: string = 'RulesWidget';
  const PAGE_URL: string = '/rules';

  export let ruleId: number;
  let ruleName: string;
  let ruleDescription: string;

  $: getRuleQuery = createQuery({
    queryFn: () => getRule(),
    queryKey: [`${QUERY_PREFIX}.getRule`],
    keepPreviousData: false,
    retry: false,
  });

  const getRule = async () => {
    if (!ruleId) {
      return null;
    }

    const data: Rule = await Api.get(`/rules/getRule/${ruleId}`);
    //assert(data, nullable(SubscriptionsSchema));
    ruleName = data.name;
    ruleDescription = data.description;
    return data;
  };

  const saveRule = async () => {
    const result: number = await Api.put(`/rules/saveRule`, {
      ruleId: ruleId || 0,
      name: ruleName,
      description: ruleDescription,
    });

    if (result) {
      push(PAGE_URL);
    }
  };
</script>

<DataLoader data="{getRuleQuery}" source="Rule">
  <Row slot="data">
    <Col lg="12">
      <Card>
        <CardBody>
          <CardTitle class="mb-4">Create New Rule</CardTitle>
          <form class="outer-repeater">
            <div data-repeater-list="outer-group" class="outer">
              <div data-repeater-item class="outer">
                <FormGroup class="mb-4" row>
                  <Label for="taskname" class="col-form-label col-lg-2">Rule Name</Label>
                  <Col lg="10">
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      class="form-control"
                      placeholder="Enter Rule Name..."
                      bind:value="{ruleName}" />
                  </Col>
                </FormGroup>
                <FormGroup class="mb-4" row>
                  <Label class="col-form-label col-lg-2">Rule Description</Label>
                  <Col lg="10">
                    <Input
                      type="textarea"
                      name="description"
                      id="description"
                      bind:value="{ruleDescription}" />
                  </Col>
                </FormGroup>
              </div>
            </div>
          </form>
          <Row class="justify-content-end">
            <Col lg="10">
              <Button color="primary" on:click="{saveRule}">Save</Button>
              <a href="{PAGE_URL}" use:link class="btn btn-secondary">Cancel</a>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  </Row>
</DataLoader>
