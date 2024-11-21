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
        console.error(error);
      }

  }
  return (
    <View style={styles.container}>
      <Text>This is it working </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
