// GiftScreen.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const gifts = [
  { id: '1', images: ['https://saladowinery.com/wp-content/uploads/2017/12/gift.jpg', 'https://t3.ftcdn.net/jpg/00/57/08/46/360_F_57084608_ciyjhtwgdKSjeZwhDTNDyuMdWik8gNF9.jpg', 'https://saladowinery.com/wp-content/uploads/2017/12/gift.jpg', 'https://t3.ftcdn.net/jpg/00/57/08/46/360_F_57084608_ciyjhtwgdKSjeZwhDTNDyuMdWik8gNF9.jpg'], code: 'Mã giảm giá', value: 'Giá trị: 50k', points: '45 Điểm', description: 'Mã giảm giá 50K\nGiảm giá cho mọi loại xe' },
  { id: '2', images: ['https://saladowinery.com/wp-content/uploads/2017/12/gift.jpg', 'https://t3.ftcdn.net/jpg/00/57/08/46/360_F_57084608_ciyjhtwgdKSjeZwhDTNDyuMdWik8gNF9.jpg', 'https://saladowinery.com/wp-content/uploads/2017/12/gift.jpg', 'https://via.placeholder.com/150'], code: 'Mã giảm giá', value: 'Giá trị: 50k', points: '45 Điểm', description: 'Mã giảm giá 50K\nGiảm giá cho mọi loại xe' },
  { id: '3', images: ['https://saladowinery.com/wp-content/uploads/2017/12/gift.jpg', 'https://t3.ftcdn.net/jpg/00/57/08/46/360_F_57084608_ciyjhtwgdKSjeZwhDTNDyuMdWik8gNF9.jpg', 'https://saladowinery.com/wp-content/uploads/2017/12/gift.jpg', 'https://via.placeholder.com/150'], code: 'Mã giảm giá', value: 'Giá trị: 50k', points: '45 Điểm', description: 'Mã giảm giá 50K\nGiảm giá cho mọi loại xe' },
  { id: '4', images: ['https://saladowinery.com/wp-content/uploads/2017/12/gift.jpg', 'https://t3.ftcdn.net/jpg/00/57/08/46/360_F_57084608_ciyjhtwgdKSjeZwhDTNDyuMdWik8gNF9.jpg', 'https://saladowinery.com/wp-content/uploads/2017/12/gift.jpg', 'https://via.placeholder.com/150'], code: 'Mã giảm giá', value: 'Giá trị: 50k', points: '45 Điểm', description: 'Mã giảm giá 50K\nGiảm giá cho mọi loại xe' },
];

const GiftScreen = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('DetailGift', {
          images: item.images,
          description: item.description,
          showHeader: true,
          showTitle: true,
          showBackButton: true,
          screenTitle: 'Chi tiết quà tặng',
          functionName: 'detailGift',
        })
      }
    >
      <Image source={{ uri: item.images[0] }} style={styles.image} resizeMode="contain" />
      <Text style={styles.code}>{item.code}</Text>
      <Text style={styles.value}>{item.value}</Text>
      <View style={styles.pointsContainer}>
        <Ionicons name="star" size={16} color="#ffd700" />
        <Text style={styles.points}>{item.points}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.pointsHeader}>
        <Ionicons name="star" size={24} color="#ffd700" />
        <Text style={styles.pointsTitle}>Điểm thưởng</Text>
      </View>
      <Text style={styles.pointsValue}>0 điểm</Text>
      <FlatList
        data={gifts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default GiftScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  pointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  pointsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  pointsValue: {
    fontSize: 16,
    marginBottom: 20,
  },
  list: {
    justifyContent: 'space-between',
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    width: '48%', // 48% to leave space between the cards
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 100,
    marginBottom: 10,
  },
  code: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    marginBottom: 10,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  points: {
    fontSize: 14,
    marginLeft: 5,
  },
});
