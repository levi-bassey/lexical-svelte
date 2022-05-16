import { registerDragonSupport } from "@lexical/dragon";
import { registerPlainText } from "@lexical/plain-text";
import { mergeRegister } from "@lexical/utils";
import type { EditorState, LexicalEditor } from "lexical";
import { onMount } from "svelte";

export const setupPlainText = (
  editor: LexicalEditor,
  initialEditorState?: null | string | EditorState | (() => void)
): void => {
  onMount(() =>
    mergeRegister(
      registerPlainText(editor, initialEditorState),
      registerDragonSupport(editor)
    )
  );
};
