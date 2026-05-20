import { copyFileSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const sourceDir = join(root, 'node_modules', '@ffmpeg', 'core', 'dist')
const targetDir = join(root, 'public', 'ffmpeg')

mkdirSync(targetDir, { recursive: true })

for (const fileName of readdirSync(sourceDir)) {
  if (fileName.startsWith('ffmpeg-core.')) {
    copyFileSync(join(sourceDir, fileName), join(targetDir, fileName))
  }
}
