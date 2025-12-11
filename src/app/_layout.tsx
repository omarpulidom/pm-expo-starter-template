import '../global.css'
import { useFonts } from '@expo-google-fonts/montserrat'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { AppFonts } from '@/components/fonts/fonts'
import { AppProviders } from '@/components/Providers/AppProviders'

SplashScreen.preventAutoHideAsync()

function RootStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  )
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...AppFonts,
  })

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [
    loaded,
    error,
  ])

  if (!loaded && !error) {
    return null
  }

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
      }}
    >
      <StatusBar hidden={true} backgroundColor={'transparent'} />
      <AppProviders>
        <RootStack />
      </AppProviders>
    </GestureHandlerRootView>
  )
}
