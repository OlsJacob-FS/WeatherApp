import React, { useEffect, useState } from "react"; // React and hooks for managing state and effects
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native"; // Core UI components
import * as Location from "expo-location"; // Expo's Location API
import axios from "axios"; // Axios for API requests
import Constants from "expo-constants"; // To access app constants

const MainScreen = () => {
  const [location, setLocation] = useState(null); // State to store user's location
  const [weather, setWeather] = useState(null); // State to store fetched weather data
  const [isLoading, setIsLoading] = useState(true); // State to track loading status

  // Function to fetch user's location
  const fetchLocation = async () => {
    try {
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to fetch weather data."
        );
        setIsLoading(false);
        return;
      }

      // Get the user's current location
      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords); // Save coordinates in state
    } catch (error) {
      console.error("Error fetching location:", error);
      Alert.alert("Error", "Unable to fetch location. Please try again.");
      setIsLoading(false);
    }
  };

  // Function to fetch weather data based on GPS coordinates
  const fetchWeather = async (latitude, longitude) => {
    const apiKey = Constants.expoConfig.extra.apiKey;
    // OpenWeather API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;
    try {
      const response = await axios.get(url); // Send GET request to OpenWeather API
      setWeather(response.data); // Save weather data in state
    } catch (error) {
      console.error("Error fetching weather data:", error);
      Alert.alert("Error", "Unable to fetch weather data. Please try again.");
    } finally {
      setIsLoading(false); // Set loading to false after fetching data
    }
  };

  // useEffect to fetch location and weather on component load
  useEffect(() => {
    const loadWeatherData = async () => {
      setIsLoading(true); // Start loading spinner
      await fetchLocation(); // Fetch the user's location
    };
    loadWeatherData();
  }, []);

  // useEffect to fetch weather data once location is available
  useEffect(() => {
    if (location) {
      const { latitude, longitude } = location; // Destructure coordinates
      fetchWeather(latitude, longitude); // Fetch weather data for the location
    }
  }, [location]); // Trigger this effect whenever the location changes

  if (isLoading) {
    // Render a loading spinner while fetching data
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#A7C080" />
      </View>
    );
  }

  if (!weather) {
    // Show an error message if weather data is not available
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Unable to fetch weather data. Please try again later.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Display Current Weather */}
      <View style={styles.weatherContainer}>
        <Text style={styles.cityName}>{weather.name}</Text>
        <Text style={styles.temperature}>{weather.main.temp}°F</Text>
        <Text style={styles.description}>{weather.weather[0].description}</Text>
        <Image
          source={{
            uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
          }}
          style={styles.weatherIcon}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Full-screen layout
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
    backgroundColor: "#2B3339", // Everforest dark background
    padding: 20,
  },
  weatherContainer: {
    alignItems: "center", // Center weather info
    backgroundColor: "#3C474D", // Card background color
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000", // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Elevation for Android
  },
  cityName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D3C6AA", // Everforest beige
  },
  temperature: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#A7C080", // Everforest green
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#D3C6AA",
    textTransform: "capitalize",
  },
  weatherIcon: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    color: "#E69875", // Everforest muted orange
    textAlign: "center",
  },
});

export default MainScreen;
