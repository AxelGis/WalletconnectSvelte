import * as monaco from 'monaco-editor';
import * as vscode from 'vscode';
import '@codingame/monaco-vscode-typescript-basics-default-extension';
import { MonacoLanguageClient } from 'monaco-languageclient';
import { CloseAction, ErrorAction, MessageTransports } from 'vscode-languageclient';
import {
  WebSocketMessageReader,
  WebSocketMessageWriter,
  toSocket,
} from 'vscode-ws-jsonrpc';

import {
  PP_SCRIPT_LANGUAGE_CLIENT_NAME,
  PP_SCRIPT_LANGUAGE_ID,
  PP_SCRIPT_WORKSPACE,
} from 'src/constants/ppscript';

/**
 * Create websocket for language client
 * @param url
 * @returns
 */
export const createWebSocket = (url: string): WebSocket => {
  const webSocket = new WebSocket(url);
  webSocket.onopen = async () => {
    const socket = toSocket(webSocket);
    const reader = new WebSocketMessageReader(socket);
    const writer = new WebSocketMessageWriter(socket);
    const languageClient = createLanguageClient({
      reader,
      writer,
    });
    await languageClient.start();
    reader.onClose(() => languageClient.stop());
  };
  return webSocket;
};

/**
 * Create language client
 * @param transports
 * @returns
 */
const createLanguageClient = (transports: MessageTransports): MonacoLanguageClient => {
  return new MonacoLanguageClient({
    name: PP_SCRIPT_LANGUAGE_CLIENT_NAME,
    clientOptions: {
      // use a language id as a document selector
      documentSelector: [PP_SCRIPT_LANGUAGE_ID],
      // disable the default error handler
      errorHandler: {
        error: () => ({ action: ErrorAction.Continue }),
        closed: () => ({ action: CloseAction.DoNotRestart }),
      },
      workspaceFolder: {
        index: 0,
        name: 'workspace',
        uri: monaco.Uri.parse(PP_SCRIPT_WORKSPACE),
      },
      synchronize: {
        fileEvents: [vscode.workspace.createFileSystemWatcher('**')],
      },
    },
    // create a language client connection from the JSON RPC connection on demand
    connectionProvider: {
      get: () => {
        return Promise.resolve(transports);
      },
    },
  });
};
