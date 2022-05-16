import type { LexicalEditor } from "lexical";
import { getContext } from "svelte";
import { EDITOR_KEY } from "../editorKey";

export const getEditor = (): LexicalEditor => {
  const editor = getContext<LexicalEditor>(EDITOR_KEY);
  if (!editor) {
    throw new Error("<LexicalComposer /> is required");
  }
  return editor;
};
