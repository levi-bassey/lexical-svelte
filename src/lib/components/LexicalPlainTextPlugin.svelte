<script lang="ts">
  import { setupCanShowPlaceholder } from "$lib/utilities/setupCanShowPlaceholder";
  import { getEditor } from "$lib/utilities/getEditor";
  import type { InitialEditorStateType } from "@lexical/plain-text";
  import { setupPlainText } from "$lib/utilities/setupPlainText";

  export let initialEditorState: InitialEditorStateType | undefined = undefined;

  const editor = getEditor();
  const showPlaceHolder = setupCanShowPlaceholder(editor);
  setupPlainText(editor, initialEditorState);
</script>

<slot name="contentEditable" />
{#if $showPlaceHolder}
  <slot name="placeholder" />
{/if}
