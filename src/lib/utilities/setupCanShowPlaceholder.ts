import { $canShowPlaceholderCurry } from "@lexical/text";
import type { LexicalEditor } from "lexical";
import { onMount } from "svelte";

export const setupCanShowPlaceholder = (editor: LexicalEditor) => {
  return {
    subscribe(fn: (shouldShow: boolean) => {}) {
      fn(true);
      onMount(() => {
        return editor.registerUpdateListener(({ editorState }) => {
          const isComposing = editor.isComposing();
          const currentCanShowPlaceholder = editorState.read(
            $canShowPlaceholderCurry(isComposing)
          );
          fn(currentCanShowPlaceholder);
        });
      });
      return () => {};
    },
  };
};
