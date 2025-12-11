import type { Config } from 'tailwindcss'
import { Colors } from './src/components/colors'
import { AppFontNames } from './src/components/fonts/font-names'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,tsx}',
    './src/components/**/*.{js,ts,tsx}',
  ],

  presets: [
    require('nativewind/preset'),
  ],
  theme: {
    extend: {
      colors: Colors,
      fontFamily: {
        montserrat: [
          AppFontNames.Montserrat_500Medium,
        ],
        'montserrat-thin': [
          AppFontNames.Montserrat_100Thin,
        ],
        'montserrat-extralight': [
          AppFontNames.Montserrat_200ExtraLight,
        ],
        'montserrat-light': [
          AppFontNames.Montserrat_300Light,
        ],
        'montserrat-regular': [
          AppFontNames.Montserrat_400Regular,
        ],
        'montserrat-medium': [
          AppFontNames.Montserrat_500Medium,
        ],
        'montserrat-semibold': [
          AppFontNames.Montserrat_600SemiBold,
        ],
        'montserrat-bold': [
          AppFontNames.Montserrat_700Bold,
        ],
        'montserrat-extrabold': [
          AppFontNames.Montserrat_800ExtraBold,
        ],
        'montserrat-black': [
          AppFontNames.Montserrat_900Black,
        ],

        sans: [
          AppFontNames.Montserrat_500Medium,
          'sans-serif',
        ],
        mono: [
          AppFontNames.Montserrat_500Medium,
          'monospace',
        ],
        primary: [
          AppFontNames.Montserrat_500Medium,
          'sans-serif',
        ],
        secondary: [
          AppFontNames.Montserrat_500Medium,
          'sans-serif',
        ],
      },
    },
  },

  plugins: [],
}

export default config
