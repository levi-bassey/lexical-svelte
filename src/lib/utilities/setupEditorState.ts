import { browser } from "$app/env";
import type { LexicalEditor } from "lexical";
import { readable } from "svelte/store";

export const setupEditorState = (
  editor: LexicalEditor,
  ignoreInitialChange = true,
  ignoreSelectionChange = false
) => {
  const initial = { editorState: editor.getEditorState(), editor };

  const store = readable(initial, (set) => {
    let unregister: () => void;

    if (browser) {
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

          set({ editorState, editor });
        }
      );
    }

    return () => unregister?.();
  });

  return store;
};
