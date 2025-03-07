
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.13ed0854fa29489682d77ce369567c9d',
  appName: 'Yumvi-Pay',
  webDir: 'dist',
  server: {
    url: 'https://13ed0854-fa29-4896-82d7-7ce369567c9d.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#5B3CC4",
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#5B3CC4',
    },
  },
  ios: {
    contentInset: 'always',
  },
  android: {
    backgroundColor: "#5B3CC4",
  },
};

export default config;
