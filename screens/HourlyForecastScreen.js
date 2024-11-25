import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';

const HourlyForecastScreen = ({ route }) => {
  const { hourlyData, date } = route.params;

  const renderHourlyItem = ({ item }) => {
    const time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return (
      <View style={styles.hourlyItem}>
        {/* TIME */}
        <Text style={styles.hourlyTime}>{time}</Text>

        {/* WEATHER ICON */}
        <Image
          source={{
            uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
          }}
          style={styles.hourlyIcon}
        />
        {/* TEMPERATURE AND DESCRIPTION */}
        <View style={styles.tempContainer}>
          <Text style={styles.hourlyTemp}>{item.main.temp.toFixed(1)}°F</Text>
          <Text style={styles.hourlyDesc}>{item.weather[0].description}</Text>
        </View>

        <View style={styles.additionalDetails}>
          <Text style={styles.detailsText}>💨 {item.wind.speed.toFixed(1)}</Text>
          <Text style={styles.detailsText}>💧 {item.main.humidity}% </Text>
        </View>

      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{new Date(date).toDateString()}</Text>
      <FlatList
        data={hourlyData}
        keyExtractor={(item) => item.dt.toString()}
        renderItem={renderHourlyItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  hourlyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    borderRadius: 10,
  },
  tempContainer: {
    flex: 2,
    alignItems: 'center',
  },
  hourlyTime: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  hourlyIcon: {
    width: 40,
    height: 40,
  },
  hourlyTemp: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  hourlyDesc: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  detailsText: {
    fontSize: 14,
    color: '#555',
  },
});

export default HourlyForecastScreen;
