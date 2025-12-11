import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { HTTPError } from 'ky'
import { useState } from 'react'
// import { Image } from 'react-native'
import {
  ActivityIndicator,
  // Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { useAuth } from '@/components/Providers/AuthProvider'
// const LOGO = require('../../assets/images/logo.png') // TODO: Add generic logo

export default function Login() {
  const router = useRouter()
  const { login, isLoggingIn, mockLogin } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [checked, setChecked] = useState(false)

  const canSubmit = email.trim().length > 0 && password.trim().length > 0 && !isLoggingIn

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev)
  }

  const toggleChecked = () => {
    setChecked((prev) => !prev)
  }

  const handleSubmit = async () => {
    if (!canSubmit) return

    setFormError(null)

    try {
      await login({
        email: email.trim(),
        password,
      })
      router.replace('/')
    } catch (error) {
      let message = 'Could not log in. Please check your credentials.'

      if (error instanceof HTTPError) {
        try {
          const body = await error.response.clone().text()
          console.log('Login error response:', body)
        } catch (parseError) {
          console.warn('Unable to parse login error response', parseError)
        }
      } else if (error instanceof Error && error.message) {
        message = error.message
      }

      setFormError(message)
    }
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <KeyboardAvoidingView
        className='flex-1'
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className='flex-1'
          contentContainerStyle={{
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          <View className='flex-1 px-6 pt-6 pb-8'>
            {/* Logo Image */}
            <Animated.View entering={FadeInDown.delay(200)} className='mt-8 items-center'>
              {/* <Image
                source={LOGO}
                accessibilityIgnoresInvertColors
                resizeMode='contain'
                className='h-40 w-full'
              /> */}
              <View className='h-40 w-40 bg-gray-200 rounded-full items-center justify-center'>
                <Text className='text-gray-400 font-bold text-xl'>Logo</Text>
              </View>
            </Animated.View>
            <View>
              <Text className='text-2xl text-primary-500 font-medium mt-8 mb-4'>LOG IN</Text>
            </View>
            {/* Form */}
            <Animated.View entering={FadeInDown.delay(300)}>
              <View className='gap-6'>
                {/* Email Input */}
                <View className='gap-2'>
                  <Text className='text-sm font-medium text-black'>
                    Email
                    <Text className='text-primary'> *</Text>
                  </Text>
                  <TextInput
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text)
                      if (formError) setFormError(null)
                    }}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    placeholder='example@email.com'
                    placeholderTextColor={Colors.gray[700]}
                    inputMode='email'
                    autoCapitalize='none'
                    autoCorrect={false}
                    keyboardType='email-address'
                    className={`
                      h-14 px-4 rounded-2xl border-2 text-black
                      ${emailFocused ? 'border-primary bg-white' : 'border-gray-200 bg-gray-50'}
                      `}
                  />
                </View>
                {/* Password Input */}
                <View className='gap-2'>
                  <Text className='text-sm font-medium text-black'>
                    Password
                    <Text className='text-primary'> *</Text>
                  </Text>
                  <View
                    className={`
                      h-14 flex-row items-center rounded-2xl border-2 px-4
                      ${passwordFocused ? 'border-primary bg-white' : 'border-gray-200 bg-gray-50'}
                    `}
                  >
                    <TextInput
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text)
                        if (formError) setFormError(null)
                      }}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      placeholder='Enter your password'
                      placeholderTextColor={Colors.gray[700]}
                      secureTextEntry={!showPassword}
                      autoCapitalize='none'
                      autoCorrect={false}
                      className='flex-1 text-black'
                    />
                    <TouchableOpacity
                      onPress={handleTogglePassword}
                      className='ml-2 p-1'
                      accessibilityRole='button'
                    >
                      <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color='#6B7280' />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    className='self-end'
                    onPress={() => console.log('Forgot password')}
                  >
                    <Text className='text-sm text-primary'>Forgot your password?</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Recordar contraseña (Remember password)*/}
              <View className='flex-row items-center mt-2 gap-3 p-3'>
                <TouchableOpacity
                  onPress={() => toggleChecked()}
                  className={`w-6 h-6 rounded border items-center justify-center ${
                    checked ? 'bg-primary border-primary' : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  {checked && <Ionicons name='checkmark' size={14} color='white' />}
                </TouchableOpacity>

                <View className='flex-1'>
                  <View className='flex-row items-center justify-between'>
                    <Text
                      className={`text-sm font-medium ${checked ? 'text-secondary-900' : 'text-secondary-700'}`}
                    >
                      Remember password
                    </Text>
                  </View>
                </View>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                className={`
                  h-14 rounded-2xl items-center justify-center mt-4
                  ${!canSubmit ? 'bg-gray-400' : 'bg-primary-600'}
                `}
                onPress={handleSubmit}
                disabled={!canSubmit}
                activeOpacity={0.8}
                accessibilityRole='button'
              >
                {isLoggingIn ? (
                  <ActivityIndicator color='white' />
                ) : (
                  <Text className='text-white font-semibold text-base'>Login</Text>
                )}
              </TouchableOpacity>

              {/* DEV: Mock Login Button */}
              <TouchableOpacity
                className='h-14 rounded-2xl items-center justify-center mt-3 bg-secondary-600 border-2 border-secondary-600'
                onPress={() => {
                  mockLogin()
                  setTimeout(() => {
                    router.replace('/')
                  }, 100)
                }}
                activeOpacity={0.8}
                accessibilityRole='button'
              >
                <Text className='text-white font-semibold text-sm'>(DEV) Mock Login</Text>
              </TouchableOpacity>

              <View className='flex-row justify-end gap-2 mt-4'>
                <Text className='text-sm font-light'>Don't have an account?</Text>
                <TouchableOpacity className='self-end' onPress={() => console.log('Register here')}>
                  <Text className='text-sm font-medium text-primary'>Register here</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
            {/* Terms and Privacy */}
            <Animated.View entering={FadeInDown.delay(400)} className='mt-auto pt-8'>
              <View className='rounded-2xl bg-primary-100 p-5'>
                <Text className='text-center text-xs leading-5 text-gray-600'>
                  Al iniciar sesión, aceptas nuestros{' '}
                  <Text
                    className='text-primary underline'
                    onPress={() => console.log('Términos de Uso')}
                  >
                    Términos de Uso
                  </Text>{' '}
                  y{' '}
                  <Text
                    className='text-primary underline'
                    onPress={() => console.log('Política de Privacidad')}
                  >
                    Política de Privacidad
                  </Text>
                  . Tus datos están protegidos bajo estrictas medidas de seguridad.
                </Text>
              </View>
            </Animated.View>
            {/* Footer */}
            <View className='mt-auto pt-8 flex-row items-center justify-center gap-1'>
              <Text className='text-xs text-center text-gray-600'>Made with</Text>
              <Ionicons name='heart' size={16} color={Colors.primary[500]} />
              <Text className='text-xs text-center text-gray-600'>by pm</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
