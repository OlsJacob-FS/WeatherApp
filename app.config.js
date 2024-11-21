import 'dotenv/config';
import { version } from 'react';

export default {
    expo: {
        name: "WeatherApp",
        slug: "Weather-App",
        version: "1.0.0",
        extra: {
            apiKey: process.env.OPEN_WEATHER_API_KEY
        },
    },
}