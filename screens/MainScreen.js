import React, { useEffect, useState } from "react"; // React and hooks for managing state and effects
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native"; // Core UI components
import * as Location from "expo-location"; // Expo's Location API
import axios from "axios"; // Axios for API requests
import Constants from "expo-constants"; // To access app constants

const MainScreen = ({ navigation }) => {
  //State for location data
  const [location, setLocation] = useState(null); // State to store user's location
  // State for weather data
  const [weather, setWeather] = useState(null); // State to store fetched weather data
  //loding state
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  //forecast state
  const [forecast, setForecast] = useState([]); // State to store fetched forecast datas
  //Alerts state
  const [alerts, setAlerts] = useState([]); // State to store
  //Helper function to determine background style based on weather condition
  const getBackGroundStyle = (condition) => {
    //convert condition to lowercase
    condition = condition.toLowerCase();

    //If its raining, use a blueish background:
    if (condition.includes("rain")) {
      return "#3C474D";
    }

    //If its snowing, use a pale, icy background:
    if (condition.includes("snow")) {
      return "#A7C080";
    }

    //if its cloudy, use a greyish background:
    if (condition.includes("cloud")) {
      return "#2B3339";
    }

    //if its clear and sunny, use a bright, warm backgroun
    if (condition.includes("clear")) {
      return "#E69875";
    }
    //default background if no condition is met
    return { backgroundColor: "#2B3339" };
  };

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

  //fetch 5 day weather forecast using the users gps location
  const fetchForecast = async (latitude, longitude) => {
    const apiKey = Constants.expoConfig.extra.apiKey; // OpenWeather API key
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;

    try {
      const response = await axios.get(url);
      const dailyData = processForecastData(response.data.list);
      setForecast(dailyData); // Save processed daily forecast data
    } catch (error) {
      console.error("Error fetching forecast:", error);
      Alert.alert("Error", "Unable to fetch forecast data. Please try again.");
    } finally {
      // At this point, we have attempted to fetch both weather and forecast
      setIsLoading(false);
    }
  };

  //Process the forecast data to get daily data
  const processForecastData = (list) => {
    const groupedData = {};
    list.forEach((item) => {
      const date = new Date(item.dt * 1000).toISOString().split("T")[0];
      if (!groupedData[date]) {
        groupedData[date] = {
          date,
          tempMax: item.main.temp_max,
          tempMin: item.main.temp_min,
          icon: item.weather[0].icon,
          description: item.weather[0].description,
          hourly: [item],
        };
      } else {
        groupedData[date].tempMax = Math.max(
          groupedData[date].tempMax,
          item.main.temp
        );
        groupedData[date].tempMin = Math.min(
          groupedData[date].tempMin,
          item.main.temp
        );
        groupedData[date].hourly.push(item);
      }
    });

    //Convert the grouped object to an array
    const dailyForecastArray = Object.values(groupedData);

    //Sort by date so it is in order
    dailyForecastArray.sort((a, b) => new Date(a.date) - new Date(b.date));

    return dailyForecastArray;
  };

  // //Fetch Alerts to display on the home page for users to see
  // const fetchAlerts = async (latitude, longitude) => {
  //   const apiKey = Constants.expoConfig.extra.apiKey;
  //   const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
  //   try {
  //     const response = await axios.get(url);
  //     if (response.data.alerts && response.data.alerts.length > 0) {
  //       setAlerts(response.data.alerts);
  //     } else {
  //       setAlerts([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching alerts:", error);
  //     Alert.alert("Error", "Unable to fetch weather alerts.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

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
      fetchForecast(latitude, longitude); // Fetch forecast data for the location
      //fetchAlerts(latitude, longitude); // Fetch alerts for
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

  //Get current weather data condition to determine background color
  const condition = weather.weather[0].main;
  const backgroundStyle = getBackGroundStyle(condition);

  const renderForecastItem = ({ item }) => (
    <TouchableOpacity
      style={styles.forecastItem}
      onPress={() => {
        // Navigate to HourlyForecast screen, passing the hourly data and date
        navigation.navigate("HourlyForecast", {
          hourlyData: item.hourly,
          date: item.date,
        });
      }}
    >
      <Text style={styles.forecastDate}>
        {new Date(item.date).toDateString()}
      </Text>
      <Image
        source={{
          uri: `https://openweathermap.org/img/wn/${item.icon}@2x.png`,
        }}
        style={styles.forecastIcon}
      />
      <Text style={styles.forecastTemp}>High: {item.tempMax.toFixed(1)}°C</Text>
      <Text style={styles.forecastTemp}>Low: {item.tempMin.toFixed(1)}°C</Text>
      <Text style={styles.forecastDesc}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, backgroundStyle]}>
      {/* Display today's weather at the top */}
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

      {/* Display 5-day forecast below current weather */}
      <Text style={styles.forecastTitle}>5-Day Forecast</Text>
      <FlatList
        data={forecast}
        horizontal
        keyExtractor={(item) => item.date}
        renderItem={renderForecastItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.forecastList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backfaceVisibility: "#2B3339", // Everforest dark background
    alignItems: "center", // Center align horizontally
    justifyContent: "flex-start", // Start from top
    paddingTop: 100,
  },
  weatherContainer: {
    alignItems: "center",
    backgroundColor: "#3C474D",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  cityName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D3C6AA",
  },
  temperature: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#A7C080",
    marginVertical: 5,
  },
  description: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#D3C6AA",
    textTransform: "capitalize",
  },
  weatherIcon: {
    width: 80,
    height: 80,
    marginTop: 5,
  },
  forecastTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#D3C6AA",
  },
  forecastList: {
    alignItems: "center",
  },
  forecastItem: {
    width: 120,
    alignItems: "center",
    marginRight: 15,
    padding: 10,
    backgroundColor: "#3C474D",
    borderRadius: 10,
  },
  forecastDate: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#E69875", // Everforest muted orange
    textAlign: "center",
  },
  forecastIcon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  forecastTemp: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#A7C080",
  },
  forecastDesc: {
    fontSize: 12,
    textTransform: "capitalize",
    color: "#D3C6AA",
    textAlign: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#E69875",
    textAlign: "center",
  },
});
export default MainScreen;
