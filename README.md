# 🚀 PM Expo Starter Template

A production-ready Expo starter template with TypeScript, NativeWind (Tailwind CSS), React Query, Zustand, and modern React Native development tools.

## ✨ Features

- **🎯 Expo SDK 54** - Latest Expo SDK with New Architecture enabled
- **⚛️ React 19** - Latest React with concurrent features
- **📱 Expo Router** - File-based routing with typed routes
- **🎨 NativeWind** - Tailwind CSS for React Native
- **🔄 TanStack Query** - Data fetching, caching, and state management
- **💾 Zustand** - Lightweight state management
- **📦 MMKV** - Fast key-value storage with persist support
- **🌍 Internationalization** - Full i18n support with Intl polyfills
- **🎭 Custom Fonts** - Montserrat font family pre-configured
- **🔧 TypeScript** - Full type safety with strict mode
- **✅ Biome** - Fast linter and formatter
- **🎭 Bottom Sheet** - Gorhom bottom sheet integration
- **📐 Path Aliases** - Import with `@/` prefix

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Bun](https://bun.sh/) (recommended) or npm/yarn
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [EAS CLI](https://docs.expo.dev/build/setup/) for builds
- iOS: [Xcode](https://developer.apple.com/xcode/) (macOS only)
- Android: [Android Studio](https://developer.android.com/studio)

## 🚀 Getting Started

### 1. Clone the template

```bash
git clone <repository-url>
cd pm-expo-starter-template
```

### 2. Install dependencies

```bash
bun install
```

### 3. Start development server

```bash
# Start with development build
bun dev

# Or simply start
bun start
```

### 4. Run on device/simulator

```bash
# iOS
bun ios

# Android
bun android
```

## 📁 Project Structure

```
pm-expo-starter/
├── src/
│   ├── app/                    # File-based routing (Expo Router)
│   │   ├── (auth)/            # Auth group routes
│   │   ├── (tabs)/            # Tab navigator routes
│   │   ├── _layout.tsx        # Root layout
│   │   └── index.tsx          # Home screen
│   ├── api/                    # API services and helpers
│   │   ├── req.ts             # HTTP client (ky)
│   │   └── Users/             # User API endpoints
│   ├── assets/                 # Static assets
│   │   ├── appIcons/          # App icons and splash screens
│   │   └── images/            # Images
│   ├── components/             # Reusable components
│   │   ├── Elements/          # UI elements
│   │   ├── Modals/            # Modal components
│   │   ├── Providers/         # Context providers
│   │   └── fonts/             # Font configuration
│   ├── config/                 # App configuration
│   ├── lib/                    # Utilities and helpers
│   │   ├── Constants.ts       # App constants
│   │   ├── cn/                # className utilities
│   │   ├── Errors/            # Error handling
│   │   ├── funcs/             # Helper functions
│   │   ├── mmkv/              # MMKV storage setup
│   │   ├── polyfills/         # Polyfills (Intl, etc.)
│   │   └── qc.ts              # Query client setup
│   ├── store/                  # Zustand stores
│   │   ├── auth.store.ts      # Authentication store
│   │   └── store.ts           # Root store
│   └── global.css             # Global Tailwind styles
├── android/                    # Android native code
├── ios/                        # iOS native code
├── scripts/                    # Build and utility scripts
│   ├── bump_version.ts        # Version bumping
│   └── write_env.ts           # Environment setup
├── app.json                    # Expo configuration
├── package.json               # Dependencies and scripts
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── biome.json                 # Biome linter configuration
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server with fresh environment |
| `bun start` | Start development server |
| `bun ios` | Run on iOS simulator |
| `bun android` | Run on Android emulator |
| `bun build:dev:ios` | Build development iOS locally |
| `bun build:dev:android` | Build development Android locally |
| `bun build:prev:ios` | Build preview iOS locally |
| `bun build:prev:android` | Build preview Android locally |
| `bun build:prod:ios` | Build production iOS locally |
| `bun build:prod:android` | Build production Android locally |
| `bun prebuild` | Generate native folders |
| `bun bump` | Bump version number |
| `bun ts` | Type check without emitting |

## 🎨 Styling

This template uses **NativeWind**, which brings Tailwind CSS to React Native.

```tsx
import { View, Text } from 'react-native'

export default function MyComponent() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-montserrat-bold text-gray-800">
        Hello World
      </Text>
    </View>
  )
}
```

### Custom Colors

Colors are defined in [src/components/colors.ts](src/components/colors.ts) and available in Tailwind classes.

### Fonts

Montserrat font family is pre-configured with all weights:
- `font-montserrat-thin`
- `font-montserrat-light`
- `font-montserrat-regular`
- `font-montserrat-medium`
- `font-montserrat-semibold`
- `font-montserrat-bold`
- `font-montserrat-extrabold`
- `font-montserrat-black`

## 🔄 State Management

### TanStack Query

For server state management:

```tsx
import { useQuery } from '@tanstack/react-query'

function MyComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })
}
```

### Zustand

For client state management:

```tsx
import { useAuthStore } from '@/store/auth.store'

function MyComponent() {
  const user = useAuthStore((state) => state.user)
  const login = useAuthStore((state) => state.login)
}
```

### MMKV Storage

For persistent storage:

```tsx
import { storage } from '@/lib/mmkv'

// Save data
storage.set('key', 'value')

// Get data
const value = storage.getString('key')
```

## 🌍 Internationalization

Full Intl API support with polyfills:
- `Intl.DateTimeFormat`
- `Intl.RelativeTimeFormat`
- `Intl.NumberFormat`
- `Intl.DisplayNames`
- `Intl.ListFormat`

Locales included: **English (en)** and **Spanish (es)**

## 📱 Navigation

File-based routing with Expo Router:

```tsx
// Navigate programmatically
import { router } from 'expo-router'

router.push('/profile')
router.replace('/login')
router.back()
```

## 🔧 Configuration

### Environment Variables

Configure environment-specific values in your build profiles. The `write_env.ts` script sets up the environment before development.

### App Configuration

Edit [app.json](app.json) to customize:
- App name and slug
- Bundle identifier
- Icons and splash screens
- Plugins and build settings

## 📦 Building for Production

### Local Builds

```bash
# Android
bun build:prod:android

# iOS
bun build:prod:ios
```

### EAS Builds

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for stores
eas build --platform ios --profile production
eas build --platform android --profile production
```

## 🧪 Type Checking

```bash
bun ts
```

## 🎯 Best Practices

1. **Use path aliases**: Import with `@/` prefix
2. **Type everything**: Leverage TypeScript's strict mode
3. **Keep components small**: Break down complex UIs
4. **Use React Query**: For all server state
5. **Use Zustand**: For UI and app state
6. **Follow file structure**: Keep related code together
7. **Use Biome**: Format and lint regularly

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript strictly
3. Test on both iOS and Android
4. Format code with Biome before committing

## 🙏 Acknowledgments

Built with:
- [Expo](https://expo.dev)
- [React Native](https://reactnative.dev)
- [NativeWind](https://nativewind.dev)
- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://github.com/pmndrs/zustand)
- [Biome](https://biomejs.dev)

---

Made with ❤️ by pm
