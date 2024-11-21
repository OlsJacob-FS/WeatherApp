//Import react dependants 
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';



export default function App() {

  const [city, setCity] = useState('');
  const [weather, setWeather] = useState('');

  
  const fetchWeather = async () => {
    const apiKey = Constants.manifest.extra.apiKey;
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
        );
        setWeather(response.data); 
      } catch (error) {
        console.error("Error while featching weather data", error);
      }
  }
  //Handle city input from user
  const handleInputChange = (text) => {
    setCity(text);
    if(text.length > 2) {
      fetchWeather(text);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather App</Text>
      <TextInput
        style={styles.input}
        onChangeText={text => handleInputChange(text)}
        value={city}
        placeholder='Enter city name'
      />
      {weather && (
        <View style={styles.watherContainer}>
          <Text stytle={styles.city}>{weather.name}</Text>
          <Text stytle={styles.temp}>{weather.main.temp}</Text>
          <Text stytle={styles.desc}>{weather.weather[0].description}</Text>
          </View>
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
    borderColor: `#ffffff`,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    color: '#111111',
  },
  weatherContainer: {
    alignItems: 'center',
  },
  city: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',

  },
  desc: {
    fontSize: 16,
    textTransform: 'capitalize',
    color: '#ffffff',
    
  }
});

