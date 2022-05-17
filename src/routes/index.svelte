<script>
  import "./index.css";
  import Editor from "./_components/Editor.svelte";
</script>

<div class="index">
  <h1>Lexical Svelte Demo</h1>
  <p>Note: this is an experimental build of Lexical</p>
  <Editor />
  <div class="other">
    <h2>Other Examples</h2>
    <ul>
      <li>
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a href="#"> Coming soon... </a>
      </li>
    </ul>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    background: #eee;
    font-family: system-ui, -apple-system, BlinkMacSystemFont,
      ".SFNSText-Regular", sans-serif;
    font-weight: 500;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .index {
    font-family: sans-serif;
    text-align: center;
  }

  .other h2 {
    font-size: 18px;
    color: #444;
    margin-bottom: 7px;
  }

  .other a {
    color: #777;
    text-decoration: underline;
    font-size: 14px;
  }

  .other ul {
    padding: 0;
    margin: 0;
    list-style-type: none;
  }

  h1 {
    font-size: 24px;
    color: #333;
  }
</style>
