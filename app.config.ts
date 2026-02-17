import 'dotenv/config';

const appJson = require('./app.json');
const expo = appJson.expo ?? {};
const androidConfig = expo.android ?? {};
const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export default {
  ...expo,
  android: {
    ...androidConfig,
    // Configuração edge-to-edge para Android
    softwareKeyboardLayoutMode: 'pan',
    ...(googleMapsApiKey
      ? {
          config: {
            ...(androidConfig.config ?? {}),
            googleMaps: {
              apiKey: googleMapsApiKey,
            },
          },
        }
      : {}),
  },
};
