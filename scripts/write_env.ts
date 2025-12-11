import fs from 'node:fs/promises'
import os from 'node:os'

const EXPO_ENV_PREFIX = 'EXPO_PUBLIC_'
const LOCAL_ENV_FILENAME = '.env.local'

type SupportedKeysTypes = number | boolean | string

const ENV_VARIABLES: Record<string, SupportedKeysTypes | undefined> = {}

function getLocalIp(): string | undefined {
  const networkInterfaces = os.networkInterfaces()

  for (const interfaceName in networkInterfaces) {
    const interfaceInfo = networkInterfaces[interfaceName]

    if (interfaceInfo) {
      for (const net of interfaceInfo) {
        if (net.family === 'IPv4' && !net.internal && net.address.startsWith('192')) {
          return net.address
        }
      }
    }
  }

  return undefined
}

const LOCAL_IP = getLocalIp()

ENV_VARIABLES.LOCAL_IP = LOCAL_IP

const OLD_ENV_CONTENT = await fs
  .readFile(LOCAL_ENV_FILENAME, {
    encoding: 'utf-8',
  })
  .catch(() => '')

const envFileContent = Object.entries(ENV_VARIABLES)
  .filter(
    (
      entry,
    ): entry is [
      string,
      SupportedKeysTypes,
    ] => entry[1] !== undefined,
  )
  .map(([key, value]) => `${EXPO_ENV_PREFIX}${key}=${value}`)
  .join('\n')

const DEDUPED_ENV_CONTENT = OLD_ENV_CONTENT.split('\n')
  .filter((line) => !line.startsWith(EXPO_ENV_PREFIX))
  .concat(
    envFileContent
      ? [
          '',
        ].concat(envFileContent)
      : [],
  )
  .join('\n')

await fs.writeFile(LOCAL_ENV_FILENAME, DEDUPED_ENV_CONTENT, {
  encoding: 'utf-8',
})

console.log(`Wrote ${LOCAL_ENV_FILENAME} with the following content: \n${DEDUPED_ENV_CONTENT}`)
