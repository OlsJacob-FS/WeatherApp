import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';

const HourlyForecastScreen = ({ route }) => {
  const { hourlyData, date } = route.params;

  //sort hourly data by time
const sortedHourlyData = [ ...hourlyData].sort((a, b) => {
  const hourA = new Date(a.dt * 1000).getHours();
  const hourB = new Date(b.dt * 1000).getHours();
  return hourA - hourB;
})

  const renderHourlyItem = ({ item }) => {
    const time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
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
        data={sortedHourlyData}
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
    backgroundColor: '#2B3339',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#D3C6AA',
  },
  hourlyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#A7C080',
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
    color: '#3C474D',
  },
  hourlyIcon: {
    width: 40,
    height: 40,
  },
  hourlyTemp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3C474D',
  },
  hourlyDesc: {
    fontSize: 14,
    textTransform: 'capitalize',
    color: '#3C474D',
  },
  detailsText: {
    fontSize: 14,
    color: '#555',
    color: '#3C474D',
  },
});

export default HourlyForecastScreen;
