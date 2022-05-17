import {
  createEmptyHistoryState,
  registerHistory,
  type HistoryState,
} from "@lexical/history";
import type { LexicalEditor } from "lexical";
import { afterUpdate, onDestroy } from "svelte";

export const setupHistory = (
  editor: LexicalEditor,
  externalHistoryState: () => HistoryState,
  delay = 1000
) => {
  let unregister: () => void;
  let currentHistoryState: HistoryState;

  const historyState = () =>
    externalHistoryState() ?? createEmptyHistoryState();

  afterUpdate(() => {
    if (currentHistoryState === historyState()) return;
    currentHistoryState = historyState();
    unregister?.();
    unregister = registerHistory(editor, currentHistoryState, delay);
  });

  onDestroy(() => {
    unregister();
  });
};
