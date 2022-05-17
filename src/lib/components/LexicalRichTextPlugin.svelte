<script lang="ts">
  import { getEditor, setupCanShowPlaceholder } from "$lib/utilities";
  import { setupRichText } from "$lib/utilities/setupRichText";
  import type { InitialEditorStateType } from "@lexical/plain-text";

  export let initialEditorState: InitialEditorStateType | undefined = undefined;

  const editor = getEditor();
  const showPlaceholder = setupCanShowPlaceholder(editor);
  setupRichText(editor, initialEditorState);
</script>

<slot name="contenteditable" />
{#if $showPlaceholder}
  <slot name="placeholder" />
{/if}
