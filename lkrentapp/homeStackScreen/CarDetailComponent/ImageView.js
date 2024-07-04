import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";

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
        {carInfo.images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.image} />
        ))}
      </ScrollView>
      <View style={styles.indexContainer}>
        <Text style={styles.indexText}>{`${currentIndex}/${
          carInfo.images.length
        }`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
    width: "100%",
    height: height * 0.4, // Adjust height as needed
  },
  image: {
    width: width,
    height: "100%",
  },
  indexContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  indexText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ImageView;
