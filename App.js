//Import react dependants 
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

export default function App() {

  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(null);

  const fetchWeather = async (coords = null) => {
    const apiKey = Constants.expoConfig.extra.apiKey;
    let url;

    //Check if long and lat are available
    if(coords){
      const {latitude, longitude} = coords;
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;
    } else if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    } else {
      Alert.alert('Error', "Please enter a city name or enable location services");
      return;
    }

    // if(!city){
    //   Alert.alert('Error', 'City name is required');
    //   return;
    // }
    //Set loading to true while fetching API data
    setIsLoading(true);
      try {
        const response = await axios.get(url);
        setWeather(response.data); 
      } catch (error) {
        console.error("Error while featching weather data", error);
        Alert.alert("Error", "Could not fetch weather. Check the city name")
      } finally {
        setIsLoading(false);
      }
    }

    const getLocation = async () => {
      setIsLoading(true);
      try{
        const { status } = await Location.requestForegroundPermissionsAsync()
        if( status !== 'granted'){
          Alert.alert("Permission Denied", 'Allow location access to fetch weather data.')
          setIsLoading(false);
          return;
        }

        const userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation.coords);
        fetchWeather(userLocation.coords);
      } catch (error) {
        console.error("Error while fetching location", error);
        Alert.alert("Error", "Could not fetch location. Check location settings")
        setIsLoading(false);
      }
    }
  //Handle city input from user
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather App</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setCity(text)}
        value={city}
        placeholder='Enter city name'
      />
      <TouchableOpacity style={styles.searchBtn} title="Search" onPress={fetchWeather}>
        <Text>Search</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.searchBtn} title="Search" onPress={getLocation}>
        <Text>Use Location</Text>
      </TouchableOpacity>
  {isLoading ? (
        <ActivityIndicator size="large" color="#28f5fc" style={styles.loader}/>
      ) : (
      weather && (
        <View style={styles.weatherContainer}>
          <Text style={styles.city}>{weather?.name}</Text>
          <Text style={styles.temp}>{weather?.main.temp}°F</Text>
          <Text style={styles.desc}>{weather?.weather[0].description}</Text>
          <Image source={{
            uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
          }}
          style={styles.weatherIcon}
          />
          </View>
      )
      )}
  
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#111111',
  },
  title: {
    color: '#ffffff',
    fontWeight: "bold",
    fontSize: 28,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    padding: 10,
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  weatherContainer: {
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
  },
  searchBtn: {
    backgroundColor: '#28f5fc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    width: "40%",
    borderRadius: 25,
    marginTop: 5,
  },
  city: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  temp: {
    fontSize: 20,
    color: '#007BFF',
    marginVertical: 10,
  },
  desc: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  loader: {
    marginTop: 20,
  },
  weatherIcon: {
    width: 150,
    height: 150,
    marginTop: 10,
  },
});

