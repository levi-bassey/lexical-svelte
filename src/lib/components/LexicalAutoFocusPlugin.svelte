<script lang="ts">
  import { onMount } from "svelte";
  import { getEditor } from "$lib/utilities/getEditor";

  const editor = getEditor();
  onMount(() => {
    editor.focus();
  });
</script>
