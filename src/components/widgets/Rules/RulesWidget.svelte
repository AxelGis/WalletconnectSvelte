<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query';
  import { _ } from 'svelte-i18n';
  import { link } from 'svelte-spa-router';
  import { Button, Card, CardBody, Col, Row } from 'sveltestrap';

  import { Api } from 'src/services/api';
  import DataLoader from 'src/components/helpers/DataLoader.svelte';
  import { type Rule, RulesPageActions } from 'src/components/widgets/Rules/types';

  const QUERY_PREFIX: string = 'RulesWidget';
  const PAGE_URL: string = '/rules/';

  $: getRulesQuery = createQuery({
    queryFn: () => getRules(),
    queryKey: [`${QUERY_PREFIX}.getRules`],
    keepPreviousData: true,
    retry: false,
  });

  const getRules = async () => {
    const data: Rule[] = await Api.get('/rules/getRules');
    //assert(data, nullable(SubscriptionsSchema));
    return data;
  };

  const getUrl = (rule: Rule, action: RulesPageActions = null) => {
    return action ? `${PAGE_URL}${rule.ruleId}/${action}` : `${PAGE_URL}${rule.ruleId}`;
  };
</script>

<Card>
  <CardBody>
    <Row class="justify-content-end">
      <Col lg="2">
        <a href="{`${PAGE_URL}create`}" use:link class="btn btn-success">Create rule</a>
      </Col>
    </Row>

    <div class="d-flex">
      <div class="me-2">
        <h5 class="card-title mb-4">My rules</h5>
      </div>
    </div>

    <DataLoader data="{getRulesQuery}" source="Rules" checkEmpty>
      <div class="table-responsive" slot="data">
        <table class="table align-middle table-nowrap mb-0">
          <thead>
            <tr>
              <th scope="col" colSpan="2"> Title </th>
              <th scope="col">Version</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {#each $getRulesQuery.data as rule}
              <tr>
                <td style="width: 100px;">
                  <img
                    src="{rule.image}"
                    alt=""
                    class="avatar-md h-auto d-block rounded" />
                </td>
                <td>
                  <h5 class="font-size-13 text-truncate mb-1">
                    <a href="{getUrl(rule)}" use:link class="text-dark">
                      {rule.name}
                    </a>
                  </h5>
                </td>
                <td>
                  <p class="text-muted mb-0">{rule.version}</p>
                </td>
                <td>
                  <a
                    href="{getUrl(rule, RulesPageActions.EDIT)}"
                    use:link
                    class="text-success">
                    <i class="bx bxs-pencil"></i>
                  </a>
                  <a
                    href="{getUrl(rule, RulesPageActions.CODE_EDIT)}"
                    use:link
                    class="text-success">
                    <i class="bx bx-code-alt"></i>
                  </a>
                  <button type="button" class="rules-actions">
                    <i class="bx bxs-rocket text-primary"></i>
                  </button>
                  <button type="button" class="rules-actions">
                    <i class="bx bxs-trash-alt text-danger"></i>
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </DataLoader>
  </CardBody>
</Card>

<style lang="scss">
  .rules-actions {
    background-color: transparent;
    border: 0;
    padding: 0;
  }
</style>
