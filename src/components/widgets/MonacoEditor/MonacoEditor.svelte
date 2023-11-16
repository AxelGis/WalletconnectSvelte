<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import {
    addUndoOperations,
    createMonacoEditor,
    getUndoRedoLastElement,
  } from 'src/services/monaco/editor';

  import type * as monaco from 'monaco-editor';

  let editorElement: HTMLDivElement;
  let editor: monaco.editor.IStandaloneCodeEditor;

  onMount(async () => {
    const code = `432432
4324
34
32423432`;

    editor = editor ?? (await createMonacoEditor(editorElement, code));

    editor.onDidChangeModelContent((e) => {
      const operations = getUndoRedoLastElement(editor);
      console.log(operations);
    });

    let operations = [
      {
        range: {
          startLineNumber: 3,
          endLineNumber: 4,
          startColumn: 3,
          endColumn: 9,
        },
        text: '\r\n32423432',
      },
    ];
    addUndoOperations(editor, operations);
  });

  onDestroy(() => {});
</script>

<div class="flex w-full flex-col">
  <div class="flex-grow h-screen" bind:this="{editorElement}"></div>
</div>

<style lang="scss">
  .h-screen {
    height: 400px;
  }
</style>
