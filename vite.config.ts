import { defineConfig, loadEnv } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tsconfigPaths from 'vite-tsconfig-paths'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import monacoEditorPlugin, { type IMonacoEditorOpts } from 'vite-plugin-monaco-editor';

const monacoEditorPluginDefault = ((monacoEditorPlugin as any).default) as (options: IMonacoEditorOpts) => any;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      monacoEditorPluginDefault({}),
      svelte({
        inspector: env.NODE_ENV !== 'production'
      }),
      tsconfigPaths(),
      viteStaticCopy({
        //copies lang folder to `dist` on production build
        targets: [
          {
            src: 'src/lang',
            dest: './'
          }
        ]
      })
    ],
    server: {
      proxy: {
        '/api/v1': {
          target: env.BACKEND_URL,
          changeOrigin: true,
          secure: false
        }
      }
    },
    resolve: {
      dedupe: ['monaco-editor', 'vscode']
    }
  }
})
