import { Link, Stack } from 'expo-router'

import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function NotFoundScreen() {
  return (
    <SafeAreaView className={styles.container}>
      <Stack.Screen
        options={{
          title: 'Oops!',
        }}
      />
      <Text className={styles.title}>{"This screen doesn't exist."}</Text>
      <Link href='/' className={styles.link}>
        <Text className={styles.linkText}>Go to home screen!</Text>
      </Link>
    </SafeAreaView>
  )
}

const styles = {
  container: `flex flex-1 bg-white`,
  title: `text-xl font-bold`,
  link: `mt-4 pt-4`,
  linkText: `text-[#2e78b7]`,
}
