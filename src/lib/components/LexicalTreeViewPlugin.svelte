<script lang="ts">
  import type {
    EditorState,
    ElementNode,
    GridSelection,
    LexicalNode,
    NodeSelection,
    RangeSelection,
    RootNode,
    TextNode,
  } from "lexical";
  import { $isMarkNode as isMarkNode } from "@lexical/mark";
  import {
    $getRoot as getRoot,
    $getSelection as getSelection,
    $isElementNode as isElementNode,
    $isGridSelection as isGridSelection,
    $isRangeSelection as isRangeSelection,
    $isTextNode as isTextNode,
  } from "lexical";
  import { onDestroy, onMount } from "svelte";
  import { getEditor } from "../utilities/getEditor";

  const NON_SINGLE_WIDTH_CHARS_REPLACEMENT: Record<string, string> =
    Object.freeze({
      "\t": "\\t",
      "\n": "\\n",
    });

  const NON_SINGLE_WIDTH_CHARS_REGEX = new RegExp(
    Object.keys(NON_SINGLE_WIDTH_CHARS_REPLACEMENT).join("|"),
    "g"
  );

  const SYMBOLS = Object.freeze({
    ancestorHasNextSibling: "|",
    ancestorIsLastChild: " ",
    hasNextSibling: "├",
    isLastChild: "└",
    selectedChar: "^",
    selectedLine: ">",
  });

  function printRangeSelection(selection: RangeSelection): string {
    let res = "";
    const formatText = printFormatProperties(selection);
    res += `: range ${formatText !== "" ? `{ ${formatText} }` : ""}`;
    const anchor = selection.anchor;
    const focus = selection.focus;
    const anchorOffset = anchor.offset;
    const focusOffset = focus.offset;
    res += `\n  ├ anchor { key: ${anchor.key}, offset: ${
      anchorOffset === null ? "null" : anchorOffset
    }, type: ${anchor.type} }`;
    res += `\n  └ focus { key: ${focus.key}, offset: ${
      focusOffset === null ? "null" : focusOffset
    }, type: ${focus.type} }`;
    return res;
  }

  function printObjectSelection(selection: NodeSelection): string {
    return `: node\n  └ [${Array.from(selection._nodes).join(", ")}]`;
  }

  function printGridSelection(selection: GridSelection): string {
    return `: grid\n  └ { grid: ${selection.gridKey}, anchorCell: ${selection.anchor.key}, focusCell: ${selection.focus.key} }`;
  }

  function generateContent(editorState: EditorState): string {
    let res = " root\n";
    const selectionString = editorState.read(() => {
      const selection = getSelection();
      visitTree(getRoot(), (node, indent) => {
        const nodeKey = node.getKey();
        const nodeKeyDisplay = `(${nodeKey})`;
        const typeDisplay = node.getType() || "";
        const isSelected = node.isSelected();
        const idsDisplay = isMarkNode(node)
          ? ` id: [ ${node.getIDs().join(", ")} ] `
          : "";
        res += `${isSelected ? SYMBOLS.selectedLine : " "} ${indent.join(
          " "
        )} ${nodeKeyDisplay} ${typeDisplay} ${idsDisplay} ${printNode(node)}\n`;
        res += printSelectedCharsLine({
          indent,
          isSelected,
          node,
          nodeKeyDisplay,
          selection: selection as RangeSelection,
          typeDisplay,
        });
      });
      return selection === null
        ? ": null"
        : isRangeSelection(selection)
        ? printRangeSelection(selection as RangeSelection)
        : isGridSelection(selection)
        ? printGridSelection(selection as GridSelection)
        : printObjectSelection(selection as NodeSelection);
    });
    return `${res}\n selection${selectionString}`;
  }

  function visitTree(
    currentNode: ElementNode,
    visitor: (arg0: RootNode, indent: string[]) => void,
    indent: string[] = []
  ) {
    const childNodes = currentNode.getChildren();
    const childNodesLength = childNodes.length;
    childNodes.forEach((childNode, i) => {
      visitor(
        childNode as RootNode,
        indent.concat(
          i === childNodesLength - 1
            ? SYMBOLS.isLastChild
            : SYMBOLS.hasNextSibling
        )
      );
      if (isElementNode(childNode)) {
        visitTree(
          childNode as ElementNode,
          visitor,
          indent.concat(
            i === childNodesLength - 1
              ? SYMBOLS.ancestorIsLastChild
              : SYMBOLS.ancestorHasNextSibling
          )
        );
      }
    });
  }

  function normalize(text: string) {
    return Object.entries(NON_SINGLE_WIDTH_CHARS_REPLACEMENT).reduce(
      (acc, [key, value]) => acc.replace(new RegExp(key, "g"), String(value)),
      text
    );
  }

  function printNode(node: TextNode | RootNode) {
    if (isTextNode(node)) {
      const text = node.getTextContent(true);
      const title = text.length === 0 ? "(empty)" : `"${normalize(text)}"`;
      const properties = printAllProperties(node as TextNode);
      return [title, properties.length !== 0 ? `{ ${properties} }` : null]
        .filter(Boolean)
        .join(" ")
        .trim();
    }
    return "";
  }

  const FORMAT_PREDICATES = [
    (node: TextNode) => node.hasFormat("bold") && "Bold",
    (node: TextNode) => node.hasFormat("code") && "Code",
    (node: TextNode) => node.hasFormat("italic") && "Italic",
    (node: TextNode) => node.hasFormat("strikethrough") && "Strikethrough",
    (node: TextNode) => node.hasFormat("underline") && "Underline",
  ];

  const DETAIL_PREDICATES = [
    (node: TextNode) => node.isDirectionless() && "Directionless",
    (node: TextNode) => node.isUnmergeable() && "Unmergeable",
  ];

  const MODE_PREDICATES = [
    (node: TextNode) => node.isToken() && "Token",
    (node: TextNode) => node.isSegmented() && "Segmented",
    (node: TextNode) => node.isInert() && "Inert",
  ];

  function printAllProperties(node: TextNode) {
    return [
      printFormatProperties(node),
      printDetailProperties(node),
      printModeProperties(node),
    ]
      .filter(Boolean)
      .join(", ");
  }

  function printDetailProperties(nodeOrSelection: TextNode) {
    let str = DETAIL_PREDICATES.map((predicate) => predicate(nodeOrSelection))
      .filter(Boolean)
      .join(", ")
      .toLocaleLowerCase();
    if (str !== "") str = `detail: ${str}`;
    return str;
  }

  function printModeProperties(nodeOrSelection: TextNode) {
    let str = MODE_PREDICATES.map((predicate) => predicate(nodeOrSelection))
      .filter(Boolean)
      .join(", ")
      .toLocaleLowerCase();
    if (str !== "") str = `mode: ${str}`;
    return str;
  }

  function printFormatProperties(
    nodeOrSelection: TextNode | NodeSelection | RangeSelection
  ) {
    let str = FORMAT_PREDICATES.map((predicate) =>
      predicate(nodeOrSelection as TextNode)
    )
      .filter(Boolean)
      .join(", ")
      .toLocaleLowerCase();
    if (str !== "") str = `format: ${str}`;
    return str;
  }

  function printSelectedCharsLine({
    indent,
    isSelected,
    node,
    nodeKeyDisplay,
    selection,
    typeDisplay,
  }: {
    indent: string[];
    isSelected: boolean;
    node: LexicalNode | null | undefined;
    nodeKeyDisplay: string;
    selection: RangeSelection;
    typeDisplay: string;
  }) {
    // No selection or node is not selected.
    if (
      !isTextNode(node) ||
      !isRangeSelection(selection) ||
      !isSelected ||
      isElementNode(node)
    )
      return "";
    // No selected characters.
    const anchor = selection.anchor;
    const focus = selection.focus;
    if (
      node?.getTextContent() === "" ||
      (anchor.getNode() === selection.focus.getNode() &&
        anchor.offset === focus.offset)
    )
      return "";
    const [start, end] = getSelectionStartEnd(node as TextNode, selection);
    if (start === end) return "";
    const selectionLastIndent =
      indent[indent.length - 1] === SYMBOLS.hasNextSibling
        ? SYMBOLS.ancestorHasNextSibling
        : SYMBOLS.ancestorIsLastChild;
    const indentionChars = [
      ...indent.slice(0, indent.length - 1),
      selectionLastIndent,
    ];
    const unselectedChars = Array(start).fill(" ");
    const selectedChars = Array(end - start).fill(SYMBOLS.selectedChar);
    const paddingLength = typeDisplay.length + 3; // 2 for the spaces around + 1 for the double quote.
    const nodePrintSpaces = Array(nodeKeyDisplay.length + paddingLength).fill(
      " "
    );
    return `${[
      SYMBOLS.selectedLine,
      indentionChars.join(" "),
      [...nodePrintSpaces, ...unselectedChars, ...selectedChars].join(""),
    ].join(" ")}\n`;
  }

  function getSelectionStartEnd(
    node: TextNode,
    selection: RangeSelection
  ): [number, number] {
    const anchor = selection.anchor;
    const focus = selection.focus;
    const textContent = node.getTextContent(true);
    const textLength = textContent.length;
    let start = -1;
    let end = -1;
    // Only one node is being selected.
    if (anchor.type === "text" && focus.type === "text") {
      const anchorNode = anchor.getNode();
      const focusNode = focus.getNode();
      if (
        anchorNode === focusNode &&
        node === anchorNode &&
        anchor.offset !== focus.offset
      ) {
        [start, end] =
          anchor.offset < focus.offset
            ? [anchor.offset, focus.offset]
            : [focus.offset, anchor.offset];
      } else if (node === anchorNode) {
        [start, end] = anchorNode.isBefore(focusNode)
          ? [anchor.offset, textLength]
          : [0, anchor.offset];
      } else if (node === focusNode) {
        [start, end] = focusNode.isBefore(anchorNode)
          ? [focus.offset, textLength]
          : [0, focus.offset];
      } else {
        // Node is within selection but not the anchor nor focus.
        [start, end] = [0, textLength];
      }
    }
    // Account for non-single width characters.
    const numNonSingleWidthCharBeforeSelection = (
      textContent.slice(0, start).match(NON_SINGLE_WIDTH_CHARS_REGEX) || []
    ).length;
    const numNonSingleWidthCharInSelection = (
      textContent.slice(start, end).match(NON_SINGLE_WIDTH_CHARS_REGEX) || []
    ).length;
    return [
      start + numNonSingleWidthCharBeforeSelection,
      end +
        numNonSingleWidthCharBeforeSelection +
        numNonSingleWidthCharInSelection,
    ];
  }

  export let timeTravelButtonClassName: string;
  export let timeTravelPanelButtonClassName: string;
  export let timeTravelPanelClassName: string;
  export let timeTravelPanelSliderClassName: string;
  export let viewClassName: string;

  const editor = getEditor();
  let timeStampedEditorStates: [number, EditorState][] = [];
  let content = "";
  let timeTravelEnabled = false;
  let playingIndex = 0;
  let treeElement: HTMLPreElement;
  let inputElement: HTMLInputElement;
  let isPlaying = false;

  let unregisterListener: () => void;
  $: {
    unregisterListener?.();
    content = generateContent(editor.getEditorState());
    unregisterListener = editor.registerUpdateListener(({ editorState }) => {
      const compositionKey = editor._compositionKey;
      const treeText = generateContent(editor.getEditorState());
      const compositionText =
        compositionKey !== null && `Composition key: ${compositionKey}`;
      content = [treeText, compositionText].filter(Boolean).join("\n\n");
      if (!timeTravelEnabled) {
        timeStampedEditorStates = [
          ...timeStampedEditorStates,
          [Date.now(), editorState],
        ];
      }
    });
  }

  $: totalEditorStates = timeStampedEditorStates.length;

  let timeoutId: NodeJS.Timeout;

  $: if (isPlaying) {
    timeoutId && clearTimeout(timeoutId);
    const play = () => {
      const currentIndex = playingIndex;
      if (currentIndex === totalEditorStates - 1) {
        isPlaying = false;
        return;
      }
      const currentTime = timeStampedEditorStates[currentIndex][0];
      const nextTime = timeStampedEditorStates[currentIndex + 1][0];
      const timeDiff = nextTime - currentTime;
      timeoutId = setTimeout(() => {
        playingIndex++;
        const index = playingIndex;
        const input = inputElement;
        if (input) input.value = String(index);
        editor.setEditorState(timeStampedEditorStates[index][1]);
        play();
      }, timeDiff);
    };
    play();
  }

  onMount(() => {
    // @ts-expect-error: Internal field
    treeElement.__ = editor;

    // @ts-expect-error: Internal field
    return () => (treeElement.__ = null);
  });

  onDestroy(() => {
    unregisterListener?.();
    clearTimeout(timeoutId);
  });

  const enableTimeTravel = () => {
    const rootElement = editor.getRootElement();
    if (rootElement !== null) {
      rootElement.contentEditable = "false";
      playingIndex = totalEditorStates - 1;
      timeTravelEnabled = true;
    }
  };

  const updateEditorState = (e: Event) => {
    const editorStateIndex = Number((e.target as HTMLInputElement).value);
    const timeStampedEditorState = timeStampedEditorStates[editorStateIndex];
    if (timeStampedEditorState) {
      playingIndex = editorStateIndex;
      editor.setEditorState(timeStampedEditorState[1]);
    }
  };

  const exit = () => {
    const rootElement = editor.getRootElement();
    if (rootElement) {
      rootElement.contentEditable = "true";
      const index = timeStampedEditorStates.length - 1;
      const timeStampedEditorState = timeStampedEditorStates[index];
      editor.setEditorState(timeStampedEditorState[1]);
      const input = inputElement;
      if (input) input.value = String(index);
      timeTravelEnabled = false;
      isPlaying = false;
    }
  };
</script>

<div class={viewClassName}>
  {#if !timeTravelEnabled && totalEditorStates > 2}
    <button class={timeTravelButtonClassName} on:click={enableTimeTravel}>
      Time Travel
    </button>
  {/if}
  <pre bind:this={treeElement}>{content}</pre>
  {#if timeTravelEnabled}
    <div class={timeTravelPanelClassName}>
      <button
        class={timeTravelPanelButtonClassName}
        on:click={() => (isPlaying = !isPlaying)}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <input
        bind:this={inputElement}
        class={timeTravelPanelSliderClassName}
        type="range"
        min="1"
        max={totalEditorStates - 1}
        on:input={updateEditorState}
      />
      <button class={timeTravelPanelButtonClassName} on:click={exit}>
        Exit
      </button>
    </div>
  {/if}
</div>
