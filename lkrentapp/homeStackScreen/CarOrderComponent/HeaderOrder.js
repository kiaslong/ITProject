import React from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CommonActions } from "@react-navigation/native";

const HeaderOrder = ({ carInfo,navigation, imageScale , orderId }) => {
  const handleBackPress = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Main" }],
      })
    );
    navigation.navigate("Chuyến");
  }

  return (
    <View style={styles.header}>
      <Animated.View style={[styles.imageContainer, { transform: [{ scale: imageScale }] }]}>
        <Animated.Image
          source={{ uri: carInfo.thumbImage}}
          style={styles.carImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
      </Animated.View>
      <View style={styles.content}>
        <View style={styles.headerBottom}>
          <View style={styles.titleContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Icon name="close-outline" size={28} color="#fff" />
            </TouchableOpacity>
            <View style={styles.nameContainer} >
              <View style={styles.row}> 
              <Text style={styles.carTitle}>{carInfo.title}</Text>
              <Icon name="car-outline" size={18} color="#fff" style={styles.carIcon} />
              </View>
              <Text style={styles.tripCode}>Mã số chuyến: LKO{orderId}</Text>
            </View>
           
          </View>
          <View style={styles.iconsContainer}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="person-outline" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="image-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 16,
  },
  nameContainer:{
    flexDirection:"column"
  },
  iconsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  iconButton: {
    marginLeft: 16,
  },
  row:{
    flexDirection:"row"
  },
  headerBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
    marginRight: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 30,
  },
  carTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  tripCode: {
    fontSize: 13,
    color: '#fff',
  },
  carIcon: {
    marginLeft: 10,
    marginBottom: 16,
  },
});

export default HeaderOrder;