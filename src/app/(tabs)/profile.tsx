import { Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/components/Providers/AuthProvider'

export default function ProfileTab() {
  const { logout } = useAuth()
  return (
    <SafeAreaView className='flex-1 items-center justify-center bg-gray-50'>
      <Text>Profile Tab</Text>
      <TouchableOpacity onPress={() => logout()} className='mt-4 bg-primary-100 p-2 rounded-lg'>
        <Text className='text-primary'>Log-out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}
