import type { Route } from 'expo-router'

interface IRedirectError {
  redirectTo: Route
  message?: string
}

export class RedirectError extends Error implements IRedirectError {
  redirectTo: Route

  constructor(redirectTo: Route, message?: string) {
    super(message)
    this.redirectTo = redirectTo
  }
}
