<script lang="ts">
  import { $getRoot as getRoot, $getSelection as getSelection } from "lexical";

  import Placeholder from "./Placeholder.svelte";
  import LexicalContentEditable from "$lib/components/LexicalContentEditable.svelte";
  import LexicalComposer from "$lib/components/LexicalComposer.svelte";
  import LexicalOnChangePlugin from "$lib/components/LexicalOnChangePlugin.svelte";
  import LexicalAutoFocusPlugin from "$lib/components/LexicalAutoFocusPlugin.svelte";
  import LexicalPlainTextPlugin from "$lib/components/LexicalPlainTextPlugin.svelte";
  import { editorConfig } from "./editorConfig";
  import LexicalHistoryPlugin from "$lib/components/LexicalHistoryPlugin.svelte";
  import TreeViewPlugin from "./plugins/TreeViewPlugin.svelte";

  const handleChange = (event: CustomEvent) => {
    const { editorState } = event.detail;
    editorState.read(() => {
      // Read the contents of the EditorState here.
      const root = getRoot();
      const selection = getSelection();

      console.log(root, selection);
    });
  };
</script>

<LexicalComposer initialConfig={editorConfig}>
  <div class="editor-container">
    <LexicalPlainTextPlugin>
      <LexicalContentEditable class="editor-input" slot="contenteditable" />
      <Placeholder slot="placeholder" />
    </LexicalPlainTextPlugin>
    <LexicalHistoryPlugin />
    <TreeViewPlugin />
    <LexicalOnChangePlugin on:change={handleChange} />
    <LexicalAutoFocusPlugin />
  </div>
</LexicalComposer>

<style>
  :global(.editor-input) {
    min-height: 150px;
    resize: none;
    font-size: 15px;
    caret-color: rgb(5, 5, 5);
    position: relative;
    tab-size: 1;
    outline: 0;
    padding: 15px 10px;
    caret-color: #444;
  }
  .editor-container {
    background: #fff;
    margin: 20px auto 20px auto;
    border-radius: 2px;
    max-width: 600px;
    color: #000;
    position: relative;
    line-height: 20px;
    font-weight: 400;
    text-align: left;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
</style>
