<script lang="ts">
  import {
    Col,
    Card,
    Nav,
    CardBody,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Table,
    Spinner,
    Row,
  } from 'sveltestrap';
  import SimpleBar from 'simplebar';
  import { onMount, onDestroy } from 'svelte';
  import { date, _ } from 'svelte-i18n';

  import { Api } from 'src/services/api';
  import { currency } from 'src/stores/globalStoreList';
  import PageContent from 'src/layouts/site/PageContent.svelte';

  let transactionTypes = ['all', 'swap', 'transfers', 'farming', 'rules', 'other'];

  const transactionTypeTabKeys = {
    all: 'menuitems.transactions.tabs.all',
    swap: 'menuitems.transactions.tabs.swap',
    transfers: 'menuitems.transactions.tabs.transfers',
    farming: 'menuitems.transactions.tabs.farming',
    rules: 'menuitems.transactions.tabs.rules',
    other: 'menuitems.transactions.tabs.other',
  };

  //TODO: change to more appropriate values when going production
  const TRANSACTIONS_HISTORY_FIRST_LOAD_RECORDS_AMOUNT = '6';
  const TRANSACTIONS_HISTORY_NEXT_LOAD_RECORDS_AMOUNT = '3';
  const TRANSACTIONS_HISTORY_LOAD_ON_SCROLL_TRIGGER_THRESHOLD = 10;
  const TRANSACTIONS_HISTORY_ENDPOINT_URL = '/transactions-history';

  let activeTab = 0;
  $: currentType = transactionTypes[activeTab];

  let cache = {};

  transactionTypes.forEach(async (type) => {
    cache[type] = {
      currentData: [],
      newDataChunk: [],
      loadComplete: false,
      loadingData: false,
      simpleBar: null,
      upperContainer: null,
      scrollContainer: null,
    };
  });

  $: {
    cache[currentType].currentData = [
      ...cache[currentType].currentData,
      ...cache[currentType].newDataChunk,
    ];
    cache[currentType].newDataChunk = [];
  }

  async function fetchTransactions(type: string, lastId: string, limit: string) {
    let response: any = await Api.get(TRANSACTIONS_HISTORY_ENDPOINT_URL, {
      type,
      lastId,
      limit,
    });
    return response.values;
  }

  async function onScroll(e) {
    let ctx = cache[currentType];
    if (e.target == ctx.scrollContainer) {
      if (!ctx.loadingData && !ctx.loadComplete) {
        if (
          e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop <
          TRANSACTIONS_HISTORY_LOAD_ON_SCROLL_TRIGGER_THRESHOLD
        ) {
          cache[currentType].loadingData = true;
          cache[currentType].newDataChunk = await fetchTransactions(
            currentType,
            ctx.currentData[ctx.currentData.length - 1].id,
            TRANSACTIONS_HISTORY_NEXT_LOAD_RECORDS_AMOUNT
          );
          cache[currentType].loadingData = false;
          cache[currentType].loadComplete = ctx.newDataChunk.length === 0;
        }
      }
    }
  }

  onMount(async () => {
    transactionTypes.forEach(async (type) => {
      cache[type].loadingData = true;
      cache[type].newDataChunk = await fetchTransactions(
        type,
        '0',
        TRANSACTIONS_HISTORY_FIRST_LOAD_RECORDS_AMOUNT
      );
      cache[type].loadingData = false;
      cache[type].simpleBar = new SimpleBar(cache[type].upperContainer);
      cache[type].scrollContainer = cache[type].simpleBar.getScrollElement();
      cache[type].scrollContainer.addEventListener('scroll', onScroll);
    });
  });

  const unsubscribe = currency.subscribe((value) => {
    transactionTypes.forEach(async (type) => {
      cache[type].currentData = [];
      (cache[type].loadComplete = false), (cache[type].loadingData = true);
      cache[type].newDataChunk = await fetchTransactions(
        type,
        '0',
        TRANSACTIONS_HISTORY_FIRST_LOAD_RECORDS_AMOUNT
      );
      cache[type].loadingData = false;
    });
  });

  onDestroy(unsubscribe);
</script>

<Row>
  <Col xl="6">
    <Card>
      <CardBody>
        <h4 class="card-title mb-4">{$_('menuitems.transactions.text')}</h4>
        <Nav pills class="bg-light rounded" role="tablist">
          {#each transactionTypes as transactionType, transactionTypeIndex}
            <NavItem>
              <NavLink
                on:click="{() => (activeTab = transactionTypeIndex)}"
                active="{activeTab == transactionTypeIndex}">
                {$_(transactionTypeTabKeys[transactionType])}
              </NavLink>
            </NavItem>
          {/each}
        </Nav>
        <TabContent class="mt-4">
          {#each transactionTypes as transactionType, transactionTypeIndex}
            <TabPane
              tabId="{transactionTypeIndex}"
              class="{activeTab == transactionTypeIndex ? 'active' : ''}">
              <div
                bind:this="{cache[transactionType].upperContainer}"
                class="table-responsive mh-330"
                data-simplebar>
                <div class="table-responsive">
                  <Table class="align-middle table-nowrap">
                    <tbody>
                      {#each cache[transactionType].currentData as item}
                        <tr>
                          <td class="w-50">
                            <div
                              class="font-size-22 text-{item.direction === '0'
                                ? 'primary'
                                : 'danger'}">
                              <i
                                class="bx bx-{item.direction === '0'
                                  ? 'down'
                                  : 'up'}-arrow-circle"></i>
                            </div>
                          </td>
                          <td>
                            <div>
                              <h5 class="font-size-14 mb-1">
                                {item.direction === '0'
                                  ? $_('menuitems.transactions.buyTransaction')
                                  : $_('menuitems.transactions.sellTransaction')}
                                {item.currency}
                              </h5>
                              <p class="text-muted mb-0">
                                {$date(new Date(item.timestamp * 1000), {
                                  format: 'medium',
                                })}
                              </p>
                            </div>
                          </td>
                          <td>
                            <div class="text-end">
                              <h5 class="font-size-14 mb-0">
                                {item.amount}
                                {item.currency}
                              </h5>
                            </div>
                          </td>
                          <td>
                            <div class="text-end">
                              <h5 class="font-size-14 text-muted mb-0">
                                {item.additionalCurrency}{item.additionalAmount}
                              </h5>
                            </div>
                          </td>
                        </tr>
                      {/each}
                    </tbody>
                  </Table>
                </div>
                <div class="text-center">
                  {#if cache[transactionType].loadingData}
                    <Spinner size="sm" type="border" class="m-1" />
                  {:else if cache[transactionType].loadComplete}
                    <p>{$_('menuitems.transactions.loadComplete')}</p>
                  {/if}
                </div>
              </div>
            </TabPane>
          {/each}
        </TabContent>
      </CardBody>
    </Card>
  </Col>
</Row>

<style lang="scss">
  .w-50 {
    width: 50px !important;
  }
</style>
