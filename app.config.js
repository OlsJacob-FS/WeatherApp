import 'dotenv/config';

export default {
  expo: {
    name: 'WeatherApp',
    slug: 'weatherapp',
    version: '1.0.0',
    extra: {
      apiKey: process.env.OPEN_WEATHER_API_KEY,
      fbApiKey: process.env.FIREBASE_API_KEY,
      fbAuthDomain: process.env.FIREBASE_AUTHDOMAIN,
      fbProjectId: process.env.FIREBASE_PROJECT_ID,
      fbStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      fbMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      fbAppId: process.env.FIREBASE_APP_ID,
      fbMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
    },
  },
};