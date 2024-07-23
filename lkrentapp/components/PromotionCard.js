import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';

const PromotionCard = ({ imageUrl, makeApply, modelApply, discountText, promoCode, expireDate }) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = moment();
      const end = moment(expireDate);
      const duration = moment.duration(end.diff(now));

      if (duration.asSeconds() <= 0) {
        setTimeRemaining('Đã hết hạn');
        clearInterval(intervalRef.current);
      } else {
        const days = Math.floor(duration.asDays());
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        let timeParts = [];
        if (days > 0) timeParts.push(`${days} ngày`);
        if (hours > 0) timeParts.push(`${hours} giờ`);
        if (minutes > 0) timeParts.push(`${minutes} phút`);
        if (seconds > 0) timeParts.push(`${seconds} giây`);

        timeParts = timeParts.slice(0, 2); // Only keep the two closest non-zero units

        setTimeRemaining(timeParts.join(' '));

        let intervalTime = 1000;
        if (days > 0) {
          intervalTime = 60 * 60 * 1000; // Update every hour
        } else if (hours > 0) {
          intervalTime = 60 * 1000; // Update every minute
        } else if (minutes > 0) {
          intervalTime = 1000; // Update every second
        } else {
          intervalTime = 1000; // Update every second
        }

        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(calculateTimeRemaining, intervalTime);
      }
    };

    calculateTimeRemaining();

    return () => clearInterval(intervalRef.current);
  }, [expireDate]);

  const promotionText = makeApply && modelApply
    ? `Khuyến mãi cho ${makeApply} ${modelApply}`
    : makeApply
      ? `Khuyến mãi cho ${makeApply}`
      : promoCode;

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.promotionText}>{promotionText}</Text>
        <Text style={styles.promoCodeText}>Mã: {promoCode}</Text>
        <TouchableOpacity disabled={true} style={styles.button}>
          <Text style={styles.buttonText}>{discountText.includes('%') ? discountText : `${discountText}K`}</Text>
        </TouchableOpacity>
        <Text style={styles.expireDateText}>Hết hạn sau: {timeRemaining}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    width: '82%',
    height: 210,
    margin: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
  },
  imageContainer: {
    width: '70%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  textContainer: {
    width: '30%',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  promotionText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#3f51b5',
    marginBottom: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  promoCodeText: {
    fontSize: 14,
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3f51b5',
  },
  expireDateText: {
    fontSize: 13,
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#d9534f',
  },
});

export default PromotionCard;
