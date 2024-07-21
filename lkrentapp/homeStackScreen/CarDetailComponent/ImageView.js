import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Image } from 'expo-image';

const { width, height } = Dimensions.get("window");

const ImageView = ({ carInfo }) => {
  const [currentIndex, setCurrentIndex] = useState(1);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / width) + 1; // Start index from 1
    setCurrentIndex(index > 0 ? index : 1);
  };

  return (
    <View style={styles.imageContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {carInfo.carImages.map((image, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image
              source={{ uri: image }}
              style={styles.image}
              contentFit="cover"
              cachePolicy="disk"
            />
            <View style={styles.overlay} />
          </View>
        ))}
      </ScrollView>
      <View style={styles.indexContainer}>
        <Text style={styles.indexText}>{`${currentIndex}/${
          carInfo.carImages.length
        }`}</Text>
      </View>
      <View style={styles.dotsContainer}>
        {carInfo.carImages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex - 1 === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
    width: "100%",
    height: height * 0.338, // Adjust height as needed
  },
  imageWrapper: {
    width: width,
    height: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  indexContainer: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  indexText: {
    color: "#fff",
    fontSize: 16,
  },
  dotsContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#fff",
  },
});

export default ImageView;
