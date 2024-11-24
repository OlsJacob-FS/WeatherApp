import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ForecastScreen from './screens/ForecastScreen';

const Stack = createStackNavigator();

const MainScreen = ({ navigation }) => {
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [weather, setWeather] = useState(null);

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
      <Text style={styles.title}>Weather App</Text>
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

const App = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={MainScreen} />
      <Stack.Screen name="Forecast" component={ForecastScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
