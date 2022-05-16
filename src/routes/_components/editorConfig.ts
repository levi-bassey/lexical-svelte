export const editorConfig = {
  readOnly: false,
  onError(err: Error) {
    throw err;
  },
  nodes: [],
  theme: {
    ltr: "ltr",
    rtl: "rtl",
    paragraph: "editor-paragraph",
    root: "editor-input",
  },
};
