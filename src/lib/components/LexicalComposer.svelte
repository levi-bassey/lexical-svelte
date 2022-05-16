<script lang="ts">
  import { createEventDispatcher, onMount, setContext } from "svelte";
  import { createEditor } from "lexical";
  import type { Class } from "utility-types";
  import type { LexicalNode, EditorThemeClasses } from "lexical";
  import { EDITOR_KEY } from "$lib/editorKey";
  import { registerPlainText } from "@lexical/plain-text";

  const dispatch = createEventDispatcher<{ error: Error }>();

  export let initialConfig: {
    namespace?: string;
    nodes?: Class<LexicalNode>[];
    readOnly?: boolean;
    theme?: EditorThemeClasses;
  } = {};

  const editor = createEditor({
    ...initialConfig,
    onError(error) {
      dispatch("error", error);
    },
  });

  registerPlainText(editor);

  setContext(EDITOR_KEY, editor);

  onMount(() => {
    editor.setReadOnly(initialConfig.readOnly ?? false);
  });
</script>

<slot />
