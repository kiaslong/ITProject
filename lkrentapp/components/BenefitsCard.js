import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const BenefitsCard = ({ image, title, description }) => {
  return (
    <View style={styles.card}>
      <Image 
        source={image} 
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 340, 
    backgroundColor: '#c1e1ec', 
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft:18,
    paddingRight:18,
    alignSelf: 'center',
  },
  icon: {
    width: 65,
    height: 65,
    marginRight: 18,
    borderRadius: 20,
    transform: [{ rotate: '-9deg' }], 
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    flex:1,
    fontSize: 13,
    color: '#424242', 
  },
});

export default BenefitsCard;
