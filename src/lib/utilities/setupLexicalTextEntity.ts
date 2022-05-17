import type { EntityMatch } from "@lexical/text";
import type { TextNode } from "lexical";

import { registerLexicalTextEntity } from "@lexical/text";
import { mergeRegister } from "@lexical/utils";
import { onMount } from "svelte";
import type { Class } from "utility-types";
import { getEditor } from "./getEditor";

export const setupLexicalTextEntity = <N extends TextNode>(
  getMatch: (text: string) => null | EntityMatch,
  targetNode: Class<N>,
  createNode: (textNode: TextNode) => N
): void => {
  const editor = getEditor();

  onMount(() => {
    return mergeRegister(
      ...registerLexicalTextEntity(editor, getMatch, targetNode, createNode)
    );
  });
};
