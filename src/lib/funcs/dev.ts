export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
