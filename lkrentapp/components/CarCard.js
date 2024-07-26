import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import { Image } from 'expo-image';
import moment from 'moment';

const CarCard = ({ carInfo, promotions, navigation }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handlePress = () => {
    navigation.navigate('CarDetail', { carInfo: carInfo ,animationType:"slide_from_bottom"});
  };

  const getTransmissionText = (transmission) => {
    return transmission === 'Automatic' ? 'Số tự động' : 'Số sàn';
  };

  const trimLocation = (location) => {
    const parts = location.split(',');
    if (parts.length > 2) {
      let part2 = parts[2].trim();
      let part3 = parts[3].trim();
      return [part2, part3].join(', ').trim();
    }
    return location.trim();
  };

  const applicablePromotions = promotions.filter(promo => {
    const now = moment();
    const expirationDate = moment(promo.expireDate);
    const hasMakeOrModel = promo.makeApply || promo.modelApply;
    const isMakeOrModelMatch = (!promo.makeApply || promo.makeApply === carInfo.make) && (!promo.modelApply || promo.modelApply === carInfo.model);
    return expirationDate.isAfter(now) && hasMakeOrModel && isMakeOrModelMatch;
  });

  const firstApplicablePromotion = applicablePromotions[0];
  const discountedPrice = firstApplicablePromotion
    ? firstApplicablePromotion.discount.includes('%')
      ? Math.round(carInfo.price * (1 - parseFloat(firstApplicablePromotion.discount) / 100))
      : carInfo.price - parseInt(firstApplicablePromotion.discount)
    : carInfo.price;

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.card}>
        <Image source={{ uri: carInfo.thumbImage }} style={styles.image} contentFit='cover' />
        <TouchableOpacity style={styles.heartIcon} onPress={toggleFavorite}>
          <Icon1 name={isFavorite ? 'heart' : 'heart-o'} size={24} color="#03a9f4" />
        </TouchableOpacity>
        <View style={styles.status}>
          {carInfo.fastAcceptBooking && (
            <View style={styles.fastBookingContainer}>
              <Text style={styles.fastBooking}>Đặt xe nhanh</Text>
              <Icon name="bolt-lightning" size={12} color="#FDD023" />
            </View>
          )}
          {!carInfo.requireCollateral && (
            <View style={styles.collateral}>
              <Text style={styles.collateralText}>Miễn thế chấp</Text>
              <Icon name="store-slash" size={12} color="#fff" />
            </View>
          )}
        </View>
        <View style={styles.details}>
          <View style={styles.info}>
            <Text style={styles.transmission}>{getTransmissionText(carInfo.transmission)}</Text>
            {carInfo.supportsDelivery && (
              <Text style={styles.delivery}>Giao xe tận nơi</Text>
            )}
          </View>
          <Text style={styles.title}>{carInfo.title} {carInfo.year}</Text>
          <Text numberOfLines={1} style={styles.location}>{trimLocation(carInfo.location)}</Text>
          <View style={styles.separator} />
          <View style={styles.rating}>
            <Text style={styles.ratingText}>{carInfo.rating} ⭐</Text>
            <Text style={styles.trips}>{carInfo.trips} chuyến</Text>
          </View>
          <View style={styles.priceSection}>
            <View style={styles.price}>
              <Text style={styles.oldPrice}>{carInfo.price}K₫</Text>
              <Text style={styles.newPrice}>{discountedPrice}K₫/ngày</Text>
            </View>
            {firstApplicablePromotion && (
              <Text style={styles.discount}>Giảm {firstApplicablePromotion.discount}</Text>
            )}
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
  status: {
    position: 'absolute',
    top: 3,
    left: 8,
    padding: 5,
    borderRadius: 5,
  },
  fastBooking: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 12,
  },
  fastBookingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#03a9f4',
    color: '#fff',
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
    marginTop: 5,
  },
  collateral: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#008000',
    color: '#fff',
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
    marginTop: 5,
  },
  collateralText: {
    color: '#fff',
    marginLeft: 5,
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
