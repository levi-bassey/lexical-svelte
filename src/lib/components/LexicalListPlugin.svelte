<script lang="ts">
  import { getEditor } from "$lib/utilities";
  import { setupList } from "$lib/utilities/setupList";

  const editor = getEditor();
  setupList(editor);
</script>
