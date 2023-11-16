<script lang="ts">
  import { Row, Col, Breadcrumb, BreadcrumbItem } from 'sveltestrap';

  export let title;
  export let breadcrumbItem;
</script>

<Row>
  <Col xs="12">
    <div class="page-title-box d-sm-flex align-items-center justify-content-between">
      <Row class="title">
        <Col><h4 class="mb-sm-0 font-size-18">{breadcrumbItem}</h4></Col>
        {#if $$slots.after_title}
          <Col><slot name="after_title" /></Col>
        {/if}
      </Row>
      <div class="page-title-right">
        <Row>
          <Breadcrumb>
            <BreadcrumbItem>
              <a href="/">{title}</a>
            </BreadcrumbItem>
            <BreadcrumbItem active>
              <a href="/">{breadcrumbItem}</a>
            </BreadcrumbItem>
          </Breadcrumb>
        </Row>
      </div>
    </div>
  </Col>
</Row>

<style lang="scss">
  :global(.title) {
    align-items: center;
  }
</style>
