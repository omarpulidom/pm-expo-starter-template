import { Redirect, Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { CustomTabBar } from '@/components/Elements/CustomTabBar'
import { useAuth } from '@/components/Providers/AuthProvider'

export default function TabsLayout() {
  const { user } = useAuth()

  if (!user) {
    return <Redirect href='/(auth)/login' />
  }

  return (
    <>
      <StatusBar hidden />
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          animation: 'shift',
        }}
      >
        <Tabs.Screen
          name='index'
          options={{
            title: 'Home',
          }}
        />
        <Tabs.Screen
          name='profile'
          options={{
            title: 'Profile',
          }}
        />
      </Tabs>
    </>
  )
}
