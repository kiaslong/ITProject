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

function DotIndex ({currentIndex}) {
  return (
    <View style={styles.dotsContainer}>
    {promotions.map((_, index) => (
      <View
        key={index}
        style={[
          styles.dot,
          { backgroundColor: index === currentIndex ? 'black' : 'grey' },
        ]}
      />
    ))}
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

const { width } = Dimensions.get("window");
const cardWidth = width * 1.1;
const cardSpacing = 8;

export default function HomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerHome}>
        <Image
          source={require("../assets/lkrentlogo.png")}
          style={styles.headerImage}
        />
        <Text style={styles.headerText}>Welcome,{"\n"}Phan Phi Long</Text>
        <View style={styles.iconContainer}>
          <HeartIcon />
          <Pressable onPress={() => Alert.alert("Gift icon pressed")}>
            <Ionicons
              name="gift-outline"
              size={24}
              color="black"
              style={styles.icon}
            />
          </Pressable>
        </View>
      </View>
      <SearchBar />
      <Text style={styles.promotionText}>Chương trình khuyến mãi</Text>
      <FlatListForPromotion setCurrentIndex={setCurrentIndex} />
      <DotIndex currentIndex={currentIndex} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerHome: {
    paddingTop: 80,
    paddingLeft: 20,
    paddingRight: 20,
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
    flexDirection: "row",
  },
  icon: {
    marginLeft: 18,
  },
  promotionText: {
    marginLeft: 25,
    fontSize: 20,
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
