<script lang="ts">
  import { getEditor } from "$lib/utilities/getEditor";

  import { onMount } from "svelte";

  export { className as class };
  export let ariaActiveDescendantID = "";
  export let ariaAutoComplete: "none" | "inline" | "list" | "both" = "none";
  export let ariaControls = "";
  export let ariaDescribedBy = "";
  export let ariaExpanded = false;
  export let ariaLabel = "";
  export let ariaLabelledBy = "";
  export let ariaMultiline = false;
  export let ariaOwneeID = "";
  export let ariaRequired = false;
  export let autoCapitalize = false;
  export let autoComplete = false;
  export let autoCorrect = false;
  export let id = "";
  export let role = "textbox";
  export let spellCheck = true;
  export let style = "";
  export let tabIndex = 0;

  let className = "";

  let editor = getEditor();
  let isReadOnly = true;

  onMount(() => {
    return editor.registerReadOnlyListener((currentIsReadOnly) => {
      isReadOnly = currentIsReadOnly;
    });
  });

  const editable = (node: HTMLElement) => editor.setRootElement(node);
</script>

<div
  use:editable
  aria-activedescendant={isReadOnly ? undefined : ariaActiveDescendantID}
  aria-autocomplete={isReadOnly ? undefined : ariaAutoComplete}
  aria-controls={isReadOnly ? undefined : ariaControls}
  aria-describedby={ariaDescribedBy}
  aria-expanded={isReadOnly
    ? undefined
    : role === "combobox"
    ? !!ariaExpanded
    : undefined}
  aria-label={ariaLabel}
  aria-labelledby={ariaLabelledBy}
  aria-multiline={ariaMultiline}
  aria-owns={isReadOnly ? undefined : ariaOwneeID}
  aria-required={ariaRequired}
  autocapitalize={`${autoCapitalize}`}
  autocomplete={`${autoComplete}`}
  autocorrect={`${autoCorrect}`}
  class={className}
  contenteditable={!isReadOnly}
  {id}
  role={isReadOnly ? undefined : role}
  spellcheck={spellCheck}
  {style}
  tabindex={tabIndex}
/>
