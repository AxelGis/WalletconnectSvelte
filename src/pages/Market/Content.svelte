<script lang="ts">
  import { Card, CardBody, Col, Row } from 'sveltestrap';
  import { _ } from 'svelte-i18n';

  import data from './marketTopRules';
</script>

<Row>
  {#each data.jobVacancy as item}
    <Col lg="{6}" xl="4">
      <Card class="market-card">
        <CardBody class="p-5">
          <div class="text-center mb-3">
            <img src="{item.img}" alt="" class="avatar-lg" />
            <a href="/rule" class="text-body">
              <h5 class="mt-4 mb-2 font-size-15">{$_(item.title)}</h5>
            </a>
            <p class="mb-0 text-muted">{$_(item.description)}</p>
          </div>
        </CardBody>
      </Card>
    </Col>
  {/each}
</Row>
