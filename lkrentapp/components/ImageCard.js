import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get('window');

const ImageCard = ({
  imageUri,
  title,
  description,
  buttonText,
  showTitle = true,
  showDescription = true,
  showButton = true,
}) => {
  const navigation = useNavigation();

  const handleMenuPress = () => {
    navigation.navigate("UserRegisterCarScreen", {
      showHeader: true,
      showTitle: true,
      showBackButton: true,
      screenTitle: "Danh Sách Xe",
      showIcon: true,
      iconName: "car",
      functionName: "registerCar"
    });
  };

  return (
    <View style={styles.card}>
      <ImageBackground 
        source={{ uri: imageUri }} 
        style={styles.image}
      >
        <View style={styles.overlay} />
        <View style={styles.textContainer}>
          {showTitle && <Text style={styles.title}>{title}</Text>}
          {showDescription && (
            <Text style={styles.description}>
              {description}
              <Text style={styles.link}> Tìm hiểu thêm</Text>
            </Text>
          )}
          {showButton && (
            <TouchableOpacity style={styles.button} onPress={handleMenuPress}>
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
    height: 220,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 20,
    alignSelf: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  textContainer: {
    alignItems: 'flex-start', // Changed from 'left' to 'flex-start'
    paddingHorizontal: 20,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  link: {
    color: '#03a9f4',
  },
  button: {
    width: "50%",
    backgroundColor: '#03a9f4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ImageCard;
