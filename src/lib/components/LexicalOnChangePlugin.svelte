<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import type { EditorState, LexicalEditor } from "lexical";
  import { getEditor } from "$lib/utilities/getEditor";

  export let ignoreInitialChange = true;
  export let ignoreSelectionChange = false;

  export let value: EditorState | null = null;

  const dispatch = createEventDispatcher<{
    change: { editorState: EditorState; editor: LexicalEditor };
  }>();

  const editor = getEditor();

  onMount(() => {
    editor.registerUpdateListener(
      ({ editorState, dirtyElements, dirtyLeaves, prevEditorState }) => {
        if (
          ignoreSelectionChange &&
          dirtyElements.size === 0 &&
          dirtyLeaves.size === 0
        ) {
          return;
        }

        if (ignoreInitialChange && prevEditorState.isEmpty()) {
          return;
        }

        value = editorState;
        dispatch("change", { editorState, editor });
      }
    );
  });
</script>
