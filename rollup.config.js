// See: https://rollupjs.org/introduction/

import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { readFileSync } from 'fs'

const payload_plugin = () => {
  return {
    name: 'payload_plugin',
    load(id) {
      if (id.endsWith('src/payload.js')) {
        const pyid = id.replace('.js', '.py')
        console.log(`Raw load of ${pyid} as export of ${id}`)
        const content = readFileSync(id.replace('.js', '.py')).toString('utf-8')
        const b64_content = Buffer.from(content).toString('base64')
        return `export const b64payload = '${b64_content}'`
      }
    }
  }
}

const config = {
  input: 'src/index.js',
  output: {
    esModule: true,
    file: 'dist/index.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [commonjs(), nodeResolve({ preferBuiltins: true }), payload_plugin()]
}

export default config
