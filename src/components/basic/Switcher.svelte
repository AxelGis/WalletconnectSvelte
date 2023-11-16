<script lang="ts">
  export let id;
  let checkboxLabel = 'Label';
  export { checkboxLabel as label };
</script>

<div class="form-check form-switch form-switch-lg mb-3">
  <input type="checkbox" class="form-check-input" {id} />
  <label class="form-check-label" for="{id}">{checkboxLabel}</label>
</div>
