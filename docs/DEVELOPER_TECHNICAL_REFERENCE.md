
# Yumvi-Pay Technical Reference for Developers

## Project Structure Overview

This project is a Capacitor-wrapped React application designed for native mobile deployment.

### Key Technologies

- **Frontend UI**: React + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Mobile Wrapper**: Capacitor 7.x
- **Build System**: Vite

### Native Capabilities Implemented

1. **Authentication**
   - Biometric authentication (fingerprint/Face ID)
   - Secure credential storage

2. **Device Features**
   - Camera access for QR scanning
   - Push notifications
   - Haptic feedback
   - Safe area insets handling
   - Offline mode & sync

3. **Mobile UI Optimizations**
   - Platform-specific styling (iOS/Android)
   - Touch-friendly interactions
   - Native navigation patterns

## Getting Started with Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```

3. **Prepare for native development**
   ```bash
   npm run build
   npx cap sync
   ```

4. **Open native IDEs**
   ```bash
   npx cap open ios     # Requires macOS with Xcode
   npx cap open android # Requires Android Studio
   ```

## Building for Production

```bash
# Build the web assets
npm run build

# Sync with native projects
npx cap sync

# Open in native IDEs for final build and submission
npx cap open ios
npx cap open android
```

## Key Files for Mobile Functionality

- **`capacitor.config.ts`**: Main native configuration
- **`src/utils/platform/`**: Platform detection utilities
- **`src/hooks/useDeviceCapabilities.ts`**: Native device feature access
- **`src/services/push/pushNotificationService.ts`**: Push notification handling
- **`src/components/qrcode/QRCodeScanner.tsx`**: Native camera integration
- **`src/components/profile/MobileAppSettings.tsx`**: Mobile-specific settings

## App Store Submission Checklist

1. **iOS (App Store)**
   - Update bundle identifier in Xcode (currently `yumvipay`)
   - Configure signing certificates
   - Set proper app icons and splash screens
   - Complete App Store Connect information

2. **Android (Play Store)**
   - Update application ID if needed
   - Generate signed APK/App Bundle
   - Prepare store listing assets
   - Complete Play Console information

## Troubleshooting

If you encounter issues with native functionality:

1. Ensure Capacitor is properly synced:
   ```bash
   npx cap sync
   ```

2. Check for plugin-specific configuration issues:
   ```bash
   npx cap doctor
   ```

3. Verify native project settings in iOS and Android projects

For detailed Capacitor documentation, visit: https://capacitorjs.com/docs
