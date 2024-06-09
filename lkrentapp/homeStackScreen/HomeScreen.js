import React, { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  Text,
  Pressable,
  Alert,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "../components/SearchBar";
import CarCard from "../components/CarCard";
import PromotionCard from "../components/PromotionCard";

function HeartIcon() {
  return (
    <Pressable onPress={() => Alert.alert("Heart icon pressed")}>
      <Ionicons
        name={"heart-outline"}
        size={24}
        color={"black"}
        style={styles.icon}
      />
    </Pressable>
  );
}
function GiftIcon() {
  return (
    <Pressable onPress={() => Alert.alert("Gift icon pressed")}>
      <Ionicons
        name="gift-outline"
        size={24}
        color="black"
        style={styles.icon}
      />
    </Pressable>
  );
}

function FlatListForPromotion({ setCurrentIndex }) {
  const onScroll = useRef((event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / (cardWidth + cardSpacing)
    );
    setCurrentIndex(index);
  }).current;

  return (
    <View style={styles.flatListContainer}>
      <FlatList
        data={promotions}
        renderItem={({ item }) => (
          <View style={[styles.promotionCardWrapper, { width: cardWidth }]}>
            <PromotionCard
              imageUrl={item.imageUrl}
              promotionText={item.promotionText}
              discountText={item.discountText}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + cardSpacing}
        decelerationRate="fast"
        contentContainerStyle={styles.promotionList}
        snapToAlignment="start"
        overScrollMode="never"
        scrollToOverflowEnabled={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentOffset={{ x: -cardSpacing, y: 0 }}
        contentInset={{
          up: 0,
          down: 0,
          left: 0,
          right: width - cardWidth - cardSpacing * 2,
        }}
        ItemSeparatorComponent={() => <View style={{ width: cardSpacing }} />}
      />
    </View>
  );
}

function DotIndex({ currentIndex }) {
  return (
    <View style={styles.dotsContainer}>
      {promotions.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            { backgroundColor: index === currentIndex ? "black" : "grey" },
          ]}
        />
      ))}
    </View>
  );
}

function CarCardList({ carList }) {
  const itemWidth = width * 0.9; 
  const gap = 16; 

  return (
    <View style={styles.carCardContainer}>
      <FlatList
        data={carList}
        horizontal
        renderItem={({ item, index }) => (
          <View
            style={{
              paddingLeft: index === 0 ? 16 : gap / 2, 
              paddingTop: 10,
              paddingRight: index === carList.length - 1 ? 16 : gap / 2, 
              width: itemWidth,
            }}
          >
            <CarCard carsInfo={item} />
          </View>
        )}
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth + gap} 
        snapToAlignment="center"
        decelerationRate="fast"
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const promotions = [
  {
    id: "1",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Ow-jdSFfiCijZRPsQz6GQcoF61ahECtZMA&s",
    promotionText: "Khuyến mãi 30% phí cho thuê xe Mercedes",
    discountText: "30%",
  },
  {
    id: "2",
    imageUrl:
      "https://cdni.autocarindia.com/utils/imageresizer.ashx?n=https://cms.haymarketindia.net/model/uploads/modelimages/BMW-2-Series-Gran-Coupe-271220221147.jpg&w=872&h=578&q=75&c=1",
    promotionText: "Khuyến mãi 20% phí cho thuê xe BMW",
    discountText: "20%",
  },
  {
    id: "3",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmIwj74aj-4g71TjdSxaNpLMTTO9CpBiUm5A&s",
    promotionText: "Khuyến mãi thêm 10% cho người mới thuê xe lần đầu",
    discountText: "10%",
  },
];

const carForYou = [
  {
    id: "1",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Ow-jdSFfiCijZRPsQz6GQcoF61ahECtZMA&s",
    transmission: "Số tự động",
    delivery: "Giao xe tận nơi",
    title: "KIA MORNING 2020",
    location: "Quận Hai Bà Trưng, Hà Nội",
    rating: "5.0",
    trips: "97",
    oldPrice: "574K",
    newPrice: "474K",
    discount: "30%",
  },
  {
    id: "2",
    image:
      "https://cdni.autocarindia.com/utils/imageresizer.ashx?n=https://cms.haymarketindia.net/model/uploads/modelimages/BMW-2-Series-Gran-Coupe-271220221147.jpg&w=872&h=578&q=75&c=1",
    transmission: "Số sàn",
    delivery: "Giao xe tận nơi",
    title: "HYUNDAI I10 2019",
    location: "Quận Đống Đa, Hà Nội",
    rating: "4.8",
    trips: "120",
    oldPrice: "600K",
    newPrice: "500K",
    discount: "20%",
  },
];

const carHistory = [
  {
    id: "1",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Ow-jdSFfiCijZRPsQz6GQcoF61ahECtZMA&s",
    transmission: "Số tự động",
    delivery: "Giao xe tận nơi",
    title: "KIA MORNING 2020",
    location: "Quận Hai Bà Trưng, Hà Nội",
    rating: "5.0",
    trips: "97",
    oldPrice: "574K",
    newPrice: "474K",
    discount: "30%",
  },
];

const { width } = Dimensions.get("window");
const cardWidth = width * 1.1;
const cardSpacing = 8;

export default function HomeScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerHome}>
        <Image
          source={{
            uri: "https://cdn.idntimes.com/content-images/community/2022/03/1714382190-93512ef73cc9128141b72669a922c6ee-f48b234e3eecffd2d897cd799c3043de.jpg",
          }}
          style={styles.headerImage}
          resizeMode="auto"
        />
        <Text style={styles.headerText}>Welcome,{"\n"}Phan Phi Long</Text>
        <View style={styles.iconContainer}>
          <HeartIcon />
          <View style={styles.verticalSeparator} />
          <GiftIcon />
        </View>
      </View>
      <SearchBar navigation={navigation} />
      <Text style={styles.promotionText}>Chương trình khuyến mãi</Text>
      <FlatListForPromotion setCurrentIndex={setCurrentIndex} />
      <DotIndex currentIndex={currentIndex} />
      <Text style={styles.carCardListText}>Xe dành cho bạn</Text>
      <CarCardList carList={carForYou} />
      <Text style={styles.carCardListText}>Xe đã xem</Text>
      <CarCardList carList={carHistory} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerHome: {
    paddingTop: 55,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    paddingLeft: 10,
    flex: 1,
  },
  headerImage: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10
  },
  verticalSeparator: {
    width: 1,
    height: 18, 
    backgroundColor: 'black',
    marginHorizontal:10,
  },
  promotionText: {
    marginLeft: 25,
    textAlign: "start",
    fontSize: 18,
    fontWeight: "bold",
    padding: 2,
  },
  flatListContainer: {
    height: 185,
  },
  promotionList: {
    paddingHorizontal: cardSpacing,
  },
  promotionCardWrapper: {
    borderRadius: 10,
    overflow: "hidden",
    height: 205,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  carCardContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  carCardListText: {
    marginLeft: 25,
    textAlign: "start",
    fontSize: 18,
    fontWeight: "bold",
    paddingTop: 10,
  },
});
