<script lang="ts">
  import { getEditor } from "$lib/utilities";
  import { setupLink } from "$lib/utilities/setupLink";

  const editor = getEditor();
  setupLink(editor);
</script>
