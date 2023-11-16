import * as monaco from 'monaco-editor';
import * as vscode from 'vscode';
import { whenReady } from '@codingame/monaco-vscode-theme-defaults-default-extension';
import '@codingame/monaco-vscode-typescript-basics-default-extension';
import { createConfiguredEditor, createModelReference } from 'vscode/monaco';
import { registerExtension } from 'vscode/extensions';
import getConfigurationServiceOverride, {
  updateUserConfiguration,
} from '@codingame/monaco-vscode-configuration-service-override';
import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override';
import getThemeServiceOverride from '@codingame/monaco-vscode-theme-service-override';
import getTextmateServiceOverride from '@codingame/monaco-vscode-textmate-service-override';
import { initServices } from 'monaco-languageclient';
import {
  RegisteredFileSystemProvider,
  registerFileSystemOverlay,
  RegisteredMemoryFile,
} from '@codingame/monaco-vscode-files-service-override';
import { Uri } from 'vscode';
import { buildWorkerDefinition } from 'monaco-editor-workers';

import {
  PP_SCRIPT_LANGUAGE_ID,
  PP_SCRIPT_MODEL_FILE,
  PP_SCRIPT_WORKSPACE,
} from 'src/constants/ppscript';
import { ppExtension } from 'src/services/monaco/languageClientExtension';
import { createWebSocket } from 'src/services/monaco/languageClient';
import { isMonacoVscodeInitialized, monacoVscodeInit } from 'src/stores/monaco';

buildWorkerDefinition(
  './node_modules/monaco-editor-workers/dist/workers',
  import.meta.url,
  false
);

export type MonacoUndoRedoElement = {
  newPosition: number;
  newText: string;
  oldPosition: number;
  oldText: string;
};

const LS_URL: string = import.meta.env.VITE_LS_URL;

/**
 * Init vscode-api services
 */
export const initMonacoEditor = async () => {
  if (isMonacoVscodeInitialized()) return;
  // init vscode-api
  await initServices({
    userServices: {
      ...getThemeServiceOverride(),
      ...getTextmateServiceOverride(),
      ...getConfigurationServiceOverride(Uri.file(PP_SCRIPT_WORKSPACE)),
      ...getKeybindingsServiceOverride(),
    },
    //debugLogging: true,
    //logLevel: LogLevel.Debug,
  });

  await whenReady();
  monacoVscodeInit();
};

/**
 * Create monaco-editor with language server client
 * @param editorElement
 * @param code
 */
export const createMonacoEditor = async (editorElement: HTMLDivElement, code: string) => {
  await initMonacoEditor();

  registerExtension(ppExtension, 1);

  updateUserConfiguration(`{
    "editor.fontSize": 14,
    "workbench.colorTheme": "Default Dark Modern"
  }`);

  const fileSystemProvider = new RegisteredFileSystemProvider(false);
  fileSystemProvider.registerFile(
    new RegisteredMemoryFile(vscode.Uri.file(PP_SCRIPT_MODEL_FILE), code)
  );
  registerFileSystemOverlay(1, fileSystemProvider);

  // use the file create before
  const modelRef = await createModelReference(monaco.Uri.file(PP_SCRIPT_MODEL_FILE));
  modelRef.object.setLanguageId(PP_SCRIPT_LANGUAGE_ID);

  // create monaco editor
  const editor: monaco.editor.IStandaloneCodeEditor = createConfiguredEditor(
    editorElement,
    {
      model: modelRef.object.textEditorModel,
      automaticLayout: true,
    }
  );

  createWebSocket(LS_URL);

  return editor;
};

/**
 * Get undo/redo data
 * @param editor
 * @returns
 */
export const getUndoRedoLastElement = (editor: monaco.editor.IStandaloneCodeEditor) => {
  const model = editor.getModel();
  const lastChanges: MonacoUndoRedoElement[] = (
    model as any
  )._commandManager._undoRedoService.getLastElement(model.uri)?._data?.changes;

  const snapshot: monaco.editor.ITextSnapshot = model.createSnapshot();

  if (lastChanges) {
    const result: monaco.editor.IIdentifiedSingleEditOperation[] = lastChanges.map(
      (elem: MonacoUndoRedoElement) => {
        const range: monaco.IRange = getOperationRange(
          snapshot.read(),
          elem,
          model.getEOL()
        );

        return {
          range,
          text: elem.newText,
        };
      }
    );

    return result;
  }

  return null;
};

/**
 * Get operation range
 * @param text
 * @param elem
 * @param EOL
 * @returns
 */
const getOperationRange = (
  text: string,
  elem: MonacoUndoRedoElement,
  EOL: string = '\r\n'
) => {
  const { newPosition, newText } = elem;
  const lines: string[] = text.split(EOL);
  let position: number = 0;

  const linesRange = lines.map((line, index) => ({
    index: index + 1,
    line,
    startPosition: position,
    endPosition: (position = position + line.length + EOL.length),
  }));
  const startLine = linesRange.find(
    (lr) => lr.startPosition <= newPosition && lr.endPosition >= newPosition
  );

  const startLineNumber: number = startLine.index;

  const eols: string[] = newText.split(EOL).filter((x) => x !== '');

  const endLineNumber: number = startLineNumber + eols.length;
  const startColumn: number = newPosition - startLine.startPosition;
  const endColumn: number = eols.length > 0 ? eols[eols.length - 1].length : 0;

  return {
    startLineNumber,
    endLineNumber,
    startColumn,
    endColumn,
  };
};

/**
 * Add Undo operations to editor
 * @param editor
 * @param operations
 */
export const addUndoOperations = (
  editor: monaco.editor.IStandaloneCodeEditor,
  operations: monaco.editor.IIdentifiedSingleEditOperation[]
) => {
  const model = editor.getModel();

  model.pushEditOperations([], operations, () => []);
};
