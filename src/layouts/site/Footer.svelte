<script lang="ts">
  import { Row, Container, Col } from 'sveltestrap';
</script>

<footer class="footer">
  <Container fluid="{true}">
    <Row>
      <Col md="{12}">{new Date().getFullYear()} © ProtectedPool</Col>
    </Row>
  </Container>
</footer>
