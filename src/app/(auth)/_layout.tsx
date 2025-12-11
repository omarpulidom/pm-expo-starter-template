import type { Route } from 'expo-router'
import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@/components/Providers/AuthProvider'

const DEFAULT_APP_ROUTE = '/' as Route

export default function AuthLayout() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Redirect href={DEFAULT_APP_ROUTE} />
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name='login' />
      <Stack.Screen name='forgot-password' />
    </Stack>
  )
}
