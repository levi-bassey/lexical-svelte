<script lang="ts">
  import { getEditor } from "$lib/utilities";
  import { setupHistory } from "$lib/utilities/setupHistory";
  import type { HistoryState } from "@lexical/history";

  export let externalHistoryState: HistoryState;

  const editor = getEditor();
  setupHistory(editor, () => externalHistoryState);
</script>
