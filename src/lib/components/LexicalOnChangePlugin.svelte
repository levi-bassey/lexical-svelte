<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { EditorState, LexicalEditor } from "lexical";
  import { getEditor } from "$lib/utilities/getEditor";
  import { setupEditorState } from "$lib/utilities/setupEditorState";

  export let ignoreInitialChange = true;
  export let ignoreSelectionChange = false;

  export let value: EditorState;

  const dispatch = createEventDispatcher<{
    change: { editorState: EditorState; editor: LexicalEditor };
  }>();

  const editor = getEditor();
  const editorState = setupEditorState(
    editor,
    ignoreInitialChange,
    ignoreSelectionChange
  );

  $: value = $editorState.editorState;
  $: dispatch("change", $editorState);
</script>
