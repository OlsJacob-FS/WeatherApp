import 'dotenv/config';

export default {
  expo: {
    name: 'WeatherApp',
    slug: 'weatherapp',
    version: '1.0.0',
    extra: {
      apiKey: process.env.OPEN_WEATHER_API_KEY,
    },
  },
};