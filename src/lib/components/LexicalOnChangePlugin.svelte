<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { EditorState, LexicalEditor } from "lexical";
  import { getEditor } from "$lib/utilities/getEditor";
  import { setupEditorState } from "$lib/utilities/setupEditorState";

  const editor = getEditor();
  const dispatch = createEventDispatcher<{
    change: { editorState: EditorState; editor: LexicalEditor };
  }>();

  export let ignoreInitialChange = true;
  export let ignoreSelectionChange = false;
  export let value = editor.getEditorState();

  $: value = $editorState.editorState;
  $: dispatch("change", $editorState);

  const editorState = setupEditorState(
    editor,
    ignoreInitialChange,
    ignoreSelectionChange
  );
</script>
