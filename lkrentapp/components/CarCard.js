import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const CarCard = ({ carsInfo }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: carsInfo.image }} style={styles.image} />
      <TouchableOpacity style={styles.heartIcon} onPress={toggleFavorite}>
        <Icon name={isFavorite ? "heart" : "heart-o"} size={24} color="#03a9f4" />
      </TouchableOpacity>
      <View style={styles.status}>
        <Text style={styles.fastBooking}>Đặt xe nhanh ⚡</Text>
      </View>
      <View style={styles.details}>
        <View style={styles.info}>
          <Text style={styles.transmission}>{carsInfo.transmission}</Text>
          <Text style={styles.delivery}>{carsInfo.delivery}</Text>
        </View>
        <Text style={styles.title}>{carsInfo.title}</Text>
        <Text style={styles.location}>{carsInfo.location}</Text>
        <View style={styles.separator} />
        <View style={styles.rating}>
          <Text style={styles.ratingText}>{carsInfo.rating} ⭐</Text>
          <Text style={styles.trips}>{carsInfo.trips} chuyến</Text>
        </View>
        <View style={styles.priceSection}>
          <View style={styles.price}>
            <Text style={styles.oldPrice}>{carsInfo.oldPrice}₫</Text>
            <Text style={styles.newPrice}>{carsInfo.newPrice}₫/ngày</Text>
          </View>
          <Text style={styles.discount}>Giảm {carsInfo.discount}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    width: '100%',
    alignSelf: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
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
    shadowOffset: { width: 0, height: 2},
    elevation: 6,
  },
  status: {
    position: 'absolute',
    top: 3,
    left: 8,
    padding: 5,
    borderRadius: 5,
  },
  fastBooking: {
    backgroundColor: '#03a9f4',
    color: '#fff',
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
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
  rating: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  ratingText: {
    marginRight: 16,
    fontSize: 14,
    fontWeight: 'bold',
  },
  trips: {
    color: '#757575',
    fontSize: 14,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    color: '#757575',
    fontSize: 14,
    marginRight: 10,
  },
  newPrice: {
    fontWeight: 'bold',
    color: '#1e88e5',
    fontSize: 18,
  },
  discount: {
    backgroundColor: '#ff5722',
    color: '#fff',
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
  },
});

export default CarCard;
