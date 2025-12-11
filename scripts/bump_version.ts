import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import { join } from 'node:path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import appJson from '../app.json'
import packageJson from '../package.json'

// const version = appJson.expo.version
const version = packageJson.version
if (version !== appJson.expo.version) {
  console.warn(
    'Warning: The version in package.json does not match the version in app.json. Using package.json version.',
  )
}
const [major, minor, patch] = version.split('.').map(Number)

console.log('Current version:', version)

if (typeof major === 'undefined' || typeof minor === 'undefined' || typeof patch === 'undefined') {
  throw new Error(
    `Error: Invalid version format in package.json. Expected format is "major.minor.patch". Got: ${version}`,
  )
}

const argv = yargs(hideBin(process.argv))
  .command('$0 [type]', 'Bump the app version', (yargs) => {
    return yargs
      .positional('type', {
        describe: 'The type of bump (major, minor, patch)',
        type: 'string',
        choices: [
          'major',
          'minor',
          'patch',
        ],
      })
      .demandOption([
        'type',
      ])
  })
  .help()
  .parseSync()

const bumpType = argv.type as 'major' | 'minor' | 'patch'
let newVersion = version
switch (bumpType) {
  case 'major':
    newVersion = `${major + 1}.0.0`
    break
  case 'minor':
    newVersion = `${major}.${minor + 1}.0`
    break
  case 'patch':
    newVersion = `${major}.${minor}.${patch + 1}`
    break
  default:
    throw new Error(
      `Error: Invalid bump type "${bumpType}". Expected "major", "minor", or "patch".`,
    )
}

if (newVersion === version) {
  throw new Error('Error: New version is the same as the current version. Quitting.')
}
appJson.expo.version = newVersion
packageJson.version = newVersion

// android native specific
const versionCode = appJson.expo.android.versionCode
const newVersionCode = versionCode + 1
appJson.expo.android.versionCode = newVersionCode
console.log(`Bumping ANDROID version code from ${versionCode} to ${newVersionCode}`)

// ios native specific
const buildNumber = parseInt(appJson.expo.ios.buildNumber, 10)
const newBuildNumber = buildNumber + 1
appJson.expo.ios.buildNumber = newBuildNumber.toString()
console.log(`Bumping IOS build number from ${buildNumber} to ${newBuildNumber}`)

const appJsonPath = join(__dirname, '..', 'app.json')
fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2))

const packageJsonPath = join(__dirname, '..', 'package.json')
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

// spawn: bunx biome check --write ${appJsonPath}

const biomeChildRes = spawnSync(
  'bunx',
  [
    'biome',
    'check',
    '--write',
    appJsonPath,
    packageJsonPath,
  ],
  {
    stdio: 'inherit',
  },
)

if (biomeChildRes.status !== 0) {
  console.error('Error: Biome check failed. Please fix the issues and try again.')
  console.log(biomeChildRes.error)
  process.exit(biomeChildRes.status || 1)
}

console.log('Biome check passed.')

console.log('Adding files to git...')
const gitAddRes = spawnSync(
  'git',
  [
    'add',
    appJsonPath,
    packageJsonPath,
  ],
  {
    stdio: 'inherit',
  },
)
if (gitAddRes.status !== 0) {
  console.error('Error: git add failed.')
  process.exit(gitAddRes.status || 1)
}

const commitMessage = `chore: version bump from ${version} to ${newVersion}. Android versionCode: ${newVersionCode}, iOS buildNumber: ${newBuildNumber}`
console.log(`Commiting with message: "${commitMessage}"`)

const gitCommitRes = spawnSync(
  'git',
  [
    'commit',
    '-m',
    commitMessage,
  ],
  {
    stdio: 'inherit',
  },
)

if (gitCommitRes.status !== 0) {
  console.error('Error: git commit failed.')
  process.exit(gitCommitRes.status || 1)
}

console.log('Version bump complete!')
