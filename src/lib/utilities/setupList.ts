import type { LexicalEditor } from "lexical";

import {
  $handleListInsertParagraph,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  indentList,
  insertList,
  outdentList,
  removeList,
  ListNode,
} from "@lexical/list";
import { mergeRegister } from "@lexical/utils";
import {
  COMMAND_PRIORITY_LOW,
  INDENT_CONTENT_COMMAND,
  INSERT_PARAGRAPH_COMMAND,
  OUTDENT_CONTENT_COMMAND,
} from "lexical";
import { onMount } from "svelte";

export const setupList = (editor: LexicalEditor) => {
  onMount(() => {
    if (!editor.hasNodes([ListNode]))
      throw new Error("ListNode not registered on editor");

    return mergeRegister(
      editor.registerCommand(
        INDENT_CONTENT_COMMAND,
        () => {
          indentList();
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        OUTDENT_CONTENT_COMMAND,
        () => {
          outdentList();
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        INSERT_ORDERED_LIST_COMMAND,
        () => {
          insertList(editor, "number");
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        INSERT_UNORDERED_LIST_COMMAND,
        () => {
          insertList(editor, "bullet");
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        REMOVE_LIST_COMMAND,
        () => {
          removeList(editor);
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        INSERT_PARAGRAPH_COMMAND,
        () => {
          const hasHandledInsertParagraph = $handleListInsertParagraph();
          if (hasHandledInsertParagraph) return true;

          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  });
};
