import {
  PP_SCRIPT_EXTENSION_ALIAS,
  PP_SCRIPT_EXTENSION_EXTENSIONS,
  PP_SCRIPT_EXTENSION_NAME,
  PP_SCRIPT_EXTENSION_PUBLISHER,
  PP_SCRIPT_LANGUAGE_ID,
} from 'src/constants/ppscript';

import type { IRelaxedExtensionManifest } from 'vscode/vscode/vs/platform/extensions/common/extensions';

export const ppExtension: IRelaxedExtensionManifest = {
  name: PP_SCRIPT_EXTENSION_NAME,
  publisher: PP_SCRIPT_EXTENSION_PUBLISHER,
  version: '1.0.0',
  engines: {
    vscode: '^1.78.0',
  },
  contributes: {
    languages: [
      {
        id: PP_SCRIPT_LANGUAGE_ID,
        aliases: [PP_SCRIPT_EXTENSION_ALIAS],
        extensions: [PP_SCRIPT_EXTENSION_EXTENSIONS],
      },
    ],
    commands: [],
    keybindings: [],
  },
};
