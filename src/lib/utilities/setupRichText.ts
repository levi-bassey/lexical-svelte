import { registerDragonSupport } from "@lexical/dragon";
import { registerRichText } from "@lexical/rich-text";
import { mergeRegister } from "@lexical/utils";
import type { EditorState, LexicalEditor } from "lexical";
import { onMount } from "svelte";

export const setupRichText = (
  editor: LexicalEditor,
  initialEditorState?: null | string | EditorState | (() => void)
): void => {
  onMount(() =>
    mergeRegister(
      registerRichText(editor, initialEditorState),
      registerDragonSupport(editor)
    )
  );
};
