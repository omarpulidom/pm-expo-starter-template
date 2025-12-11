import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { QueryClientProvider } from '@tanstack/react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { queryClient } from '@/lib/qc'
import { AuthProvider } from './AuthProvider'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BottomSheetModalProvider>
            <SafeAreaProvider>{children}</SafeAreaProvider>
          </BottomSheetModalProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}
