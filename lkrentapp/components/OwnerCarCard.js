import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';


const OwnerCarCard = ({ carInfo, navigation }) => {
  const [isFavorite, setIsFavorite] = useState(false);



  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handlePress = () => {
    navigation.navigate('OwnerCarDetail', { carInfo: carInfo });
  };

  const getTransmissionText = (transmission) => {
    return transmission === 'Automatic' ? 'Số tự động' : 'Số sàn';
  };


  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.card}>
        <Image source={{ uri: carInfo.thumbImage }} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.title}>{carInfo.title} {carInfo.year}</Text>
          <Text style={styles.location}>{carInfo.location}</Text>
          <View style={styles.separator} />
          <View style={styles.info}>
            <Text style={styles.transmission}>{getTransmissionText(carInfo.transmission)}</Text>
            {carInfo.supportsDelivery ? (<Text style={styles.delivery}>{carInfo.supportsDelivery ? 'Giao xe tận nơi' : ''}</Text> ) : null }
          </View>
          <View style={styles.priceSection}>
            <Text style={styles.price}>{carInfo.price}K₫/ngày</Text>
          </View>
          <View style={styles.status}>
            <Text style={styles.statusText}>{carInfo.status}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    width: '100%',
    alignSelf: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  details: {
    padding: 15,
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 6,
    backgroundColor: '#2f4843',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  transmission: {
    backgroundColor: '#e0f7fa',
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
  },
  delivery: {
    backgroundColor: '#c8e6c9',
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  location: {
    color: '#757575',
    marginBottom: 5,
    fontSize: 14,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e88e5',
  },
  status: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
  },
  statusText: {
    color: '#757575',
    fontSize: 14,
  },
});

export default OwnerCarCard;