import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const CarDetailScreen = ({ route }) => {
  const { carInfo } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: carInfo.image }} style={styles.image} />
      <Text style={styles.title}>{carInfo.title}</Text>
      <Text style={styles.location}>{carInfo.location}</Text>
      <Text style={styles.description}>Detailed information about the car...</Text>
      {/* Add more detailed information here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#757575',
  },
});

export default CarDetailScreen;
