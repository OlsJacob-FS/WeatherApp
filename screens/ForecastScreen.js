import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';

const ForecastScreen = ({ route, navigation }) => {
  const { forecast, city } = route.params;

  // Group forecast data by day and calculate high/low temperatures
  const processForecast = (forecast) => {
    const groupedData = {};

    forecast.forEach((item) => {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0];
        if (!groupedData[date]) {
            groupedData[date] = {
                date, 
                tempMax: item.main.temp,
                tempMin: item.main.temp,
                icon: item.weather[0].icon,
                description: item.weather[0].description,
                hourly: [],
            };
        }else {
            groupedData[date].tempMax = Math.max(groupedData[date].tempMax, item.main.temp);
            groupedData[date].tempMin = Math.min(groupedData[date].tempMin, item.main.temp);
        }

        groupedData[date].hourly.push(item);
    });
    return Object.values(groupedData); //Convert object back to array
  }
    const dailyForecast = processForecast(forecast);

  
    const renderForecastItem = ({ item }) => (
        <TouchableOpacity
        style={styles.forecastItem}
        onPress={() => navigation.navigate('HourlyForecast', { hourlyData: item.hourly, date: item.date })}
        >
        
          <Text style={styles.forecastDate}>{new Date(item.date).toDateString()}</Text>
          <Image
            source={{
              uri: `https://openweathermap.org/img/wn/${item.icon}@2x.png`,
            }}
            style={styles.forecastIcon}
          />
          <Text style={styles.forecastTemp}>
            High: {item.tempMax.toFixed(1)}°F | Low: {item.tempMin.toFixed(1)}°F
          </Text>
          <Text style={styles.forecastDesc}>{item.description}</Text>
        
        </TouchableOpacity>
      );

 
      return (
        <View style={styles.container}>
          <Text style={styles.city}>{city}</Text>
          <FlatList
            data={dailyForecast}
            horizontal
            keyExtractor={(item) => item.date}
            renderItem={renderForecastItem}
            showsVerticalScrollIndicator={false}
          />
        </View>
      );
    };

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          padding: 10,
          marginTop: 15,
          backgroundColor: '#f5f5f5',
          Height: 300,
          width: '100%',
        },
        city: {
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 20,
          textAlign: 'center',
        },
        forecastItem: {
          alignItems: 'center',
          width: '100',
          height: '225',
          margin: 10,
          padding: 10,
          backgroundColor: '#e0f7fa',
          borderWidth: 1,
          borderColor: '#000000',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          borderRadius: 10,
        },
        forecastDate: {
          fontSize: 14,
          fontWeight: 'bold',
          marginBottom: 5,
        },
        forecastIcon: {
          width: 50,
          height: 50,
        },
        forecastTemp: {
          fontSize: 16,
          fontWeight: 'bold',
        },
        forecastDesc: {
          fontSize: 12,
          textTransform: 'capitalize',
        },
      });

export default ForecastScreen;
