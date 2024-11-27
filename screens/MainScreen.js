import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import * as Location from 'expo-location';

import { createStackNavigator } from '@react-navigation/stack';


const MainScreen = ({ navigation }) => {
    const [city, setCity] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
  
    const fetchForecast = async (coords = null) => {
      const apiKey = Constants.expoConfig.extra.apiKey;
      let url;
  
      if (coords) {
        const { latitude, longitude } = coords;
        url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;
      } else if (city) {
        url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;
  
      } else {
        Alert.alert('Error', 'Please enter a city name or enable location.');
        return;
      }
  
      setIsLoading(true);
      try {
        const response = await axios.get(url);
        const forecast = response.data.list;
        navigation.navigate('Forecast', { forecast, city: response.data.city.name });
      } catch (error) {
        console.error('Error fetching forecast:', error);
        Alert.alert('Error', 'Could not fetch forecast. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
  
    const getLocation = async () => {
      setIsLoading(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Allow location access to fetch weather.');
          setIsLoading(false);
          return;
        }
  
        const userLocation = await Location.getCurrentPositionAsync({});
        fetchForecast(userLocation.coords);
      } catch (error) {
        console.error('Error getting location:', error);
        Alert.alert('Error', 'Could not fetch location. Please try again.');
        setIsLoading(false);
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Mossy Skies</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter city name"
          value={city}
          onChangeText={(text) => setCity(text)}
        />
        <TouchableOpacity style={styles.button} onPress={() => fetchForecast()}>
          <Text style={styles.buttonText}>Get 5-Day Forecast</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={getLocation}>
          <Text style={styles.buttonText}>Get Forecast by GPS</Text>
        </TouchableOpacity>
        {isLoading && <ActivityIndicator size="large" color="#007BFF" />}
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#2B3339',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#D3C6AA'
    },
    input: {
      width: '100%',
      height: 40,
      padding: 10,
      borderColor: '#4F5B66',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 20,
      backgroundColor: '#3C474D',
      color: '#D3C6AA',
    },
    button: {
      backgroundColor: '#A7C080',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 20,
    },
    buttonText: {
      color: '#2B3339',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  export default MainScreen;