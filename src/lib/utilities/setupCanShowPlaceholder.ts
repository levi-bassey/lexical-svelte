import { $canShowPlaceholderCurry } from "@lexical/text";
import type { LexicalEditor } from "lexical";
import { derived } from "svelte/store";
import { setupEditorState } from "./setupEditorState";

export const setupCanShowPlaceholder = (editor: LexicalEditor) => {
  const editorState = setupEditorState(editor, false, false);
  const store = derived(
    editorState,
    ({ editorState }) => {
      const isComposing = editor.isComposing();
      const currentCanShowPlaceholder = editorState.read(
        $canShowPlaceholderCurry(isComposing)
      );
      return currentCanShowPlaceholder;
    },
    false
  );

  return store;
};
