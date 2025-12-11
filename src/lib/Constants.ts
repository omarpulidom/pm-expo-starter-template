const RAW_ENV = process.env.EXPO_PUBLIC_API_ENV
const LOCAL_IP = process.env.EXPO_PUBLIC_LOCAL_IP ?? 'localhost'

const ENV =
  RAW_ENV === 'production' || RAW_ENV === 'development' || RAW_ENV === 'qa' ? RAW_ENV : 'production'

console.log({
  RAW_ENV,
  ENV,
  LOCAL_IP,
})

const API_URLS = {
  development: `http://${LOCAL_IP}:8080`,
  qa: 'https://api.qa.example.com',
  production: 'https://api.example.com',
} as const satisfies Record<typeof ENV, string>

const BASE_URL = API_URLS[ENV]

export class Constants {
  static API_PREFIX = '/v1'
  static ENV = process.env.NODE_ENV
  static IS_DEV = Constants.ENV === 'development'
  static BASE_URL = BASE_URL
  static API_URL = `${Constants.BASE_URL}${Constants.API_PREFIX}`
  static TIMEOUT = 60_000 // 60 seconds
  static S3_BUCKET_URL = 'https://' // S3 bucket URL

  static ENDPOINTS = {
    AUTH: '/auth',
  } as const
}

export type ENDPOINTS = (typeof Constants.ENDPOINTS)[keyof typeof Constants.ENDPOINTS]
