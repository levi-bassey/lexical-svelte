# Lexical Svelte

> **⚠️ Lexical is currently in early development and APIs and packages are likely to change quite often.**

This package provides a set of components and utilities for Lexical that allow for text editing in Svelte applications.

## Getting started

Install `lexical` and `lexical-svelte`:

```
npm i lexical lexical-svelte
```

Below is an example of a basic plain text editor using `lexical` and `lexical-svelte`

```svelte
<script>
  import { $getRoot as getRoot, $getSelection as getSelection } from "lexical";

  import {
      LexicalComposer,
      ContentEditable,
      PlainTextPlugin,
      OnChangePlugin,
      AutoFocusPlugin
  } from 'lexical-svelte';

  //Two way binding
  let value;

  const config = {
      theme: {
          // Theme styling goes here
      }
  }

  // Catch any errors that occur during Lexical updates and log them
  // or throw them as needed. If you don't throw them, Lexical will
  // try to recover gracefully without losing user data.
  const handleError = (error) => {
      throw error
  }

  // When the editor changes, you can get notified via the
  // OnChangePlugin!
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

<LexicalComposer initialConfig={config} on:error={handleError}>
  <div class="editor-container">
    <PlainTextPlugin>
      <ContentEditable slot="contentEditable" />
      <div slot="placeholder">
          Enter some text...
      </div>
    </PlainTextPlugin>
    <OnChangePlugin bind:value on:change={handleChange} />
    <AutoFocusPlugin />
  </div>
</LexicalComposer>
```
