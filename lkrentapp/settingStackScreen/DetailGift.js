// DetailGift.js
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, Alert, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const DetailGift = () => {
  const route = useRoute();
  const { images, description } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();

  const onViewRef = useRef((viewableItems) => {
    if (viewableItems.viewableItems.length > 0) {
      setCurrentIndex(viewableItems.viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} resizeMode="contain" />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        contentContainerStyle={styles.imageList}
        style={styles.flatList}
      />
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <Ionicons
            key={index}
            name="ellipse"
            size={8}
            color={index === currentIndex ? '#03a9f4' : '#d3d3d3'}
            style={styles.dot}
          />
        ))}
      </View>
      <ScrollView style={styles.infoContainer}>
        <Text style={styles.title}>Giới thiệu</Text>
        <Text style={styles.description}>{description}</Text>
        <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Đổi quà', 'Bạn đã đổi quà thành công')}>
          <Text style={styles.buttonText}>Đổi quà</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default DetailGift;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flatList: {
    marginTop: 20,
    height: 200, // Adjust the height as needed
  },
  imageList: {
    alignItems: 'center',
  },
  imageContainer: {
    width: width, // Adjust width to fit the screen
    height: 300, // Adjust height as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  dot: {
    marginHorizontal: 4,
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#03a9f4',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
