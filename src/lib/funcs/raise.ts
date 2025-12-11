export function raise(message: string): never {
  throw new Error(`Error: ${message}`)
}
