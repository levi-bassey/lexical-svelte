import type { LexicalEditor } from "lexical";
import { onMount } from "svelte";
import { writable, type Readable } from "svelte/store";

export const setupEditorState = (
  editor: LexicalEditor,
  ignoreInitialChange = true,
  ignoreSelectionChange = false
) => {
  const initial = { editorState: editor.getEditorState(), editor };

  const { subscribe, set } = writable(initial);

  onMount(() => {
    return editor.registerUpdateListener(
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

        set({ editorState, editor });
      }
    );
  });

  return { subscribe };
};
