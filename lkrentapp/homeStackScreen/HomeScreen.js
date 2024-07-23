// src/screens/HomeScreen.js
import React, { useState, useEffect, useRef } from "react";
import { ScrollView, View, StyleSheet, Text, Pressable, FlatList, Dimensions, Platform, RefreshControl, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CarCard from "../components/CarCard";
import PromotionCard from "../components/PromotionCard";
import ImageCard from "../components/ImageCard";
import BenefitsCard from "../components/BenefitsCard";
import SearchBox from "../components/SearchBox";
import { useSelector, useDispatch } from "react-redux";
import { Image } from "expo-image";
import { fetchCarForYou } from "../store/carListSlice";

const CarLocation = require('../assets/carlocation.jpg');
const PaperWork = require('../assets/paperwork.png');
const Delivery = require('../assets/delivery.png');
const EasyPay = require('../assets/easypay.png');
const MultiCar = require('../assets/multicar.png');

const { width } = Dimensions.get("window");
const cardWidth = width * 1.1;
const cardSpacing = 8;
const cardFullWidth = cardWidth + cardSpacing;

const promotions = [
  {
    id: "1",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Ow-jdSFfiCijZRPsQz6GQcoF61ahECtZMA&s",
    promotionText: "Khuyến mãi 30% phí cho thuê xe Mercedes",
    discountText: "30%",
  },
  {
    id: "2",
    imageUrl: "https://cdni.autocarindia.com/utils/imageresizer.ashx?n=https://cms.haymarketindia.net/model/uploads/modelimages/BMW-2-Series-Gran-Coupe-271220221147.jpg&w=872&h=578&q=75&c=1",
    promotionText: "Khuyến mãi 20% phí cho thuê xe BMW",
    discountText: "20%",
  },
  {
    id: "3",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmIwj74aj-4g71TjdSxaNpLMTTO9CpBiUm5A&s",
    promotionText: "Khuyến mãi thêm 10% cho người mới thuê xe lần đầu",
    discountText: "10%",
  },
];

const benefitsData = [
  {
    id: '1',
    image: CarLocation,
    title: 'An tâm đặt xe',
    description: 'Không tính phí hủy chuyến trong vòng 1h sau đặt cọc. Hoàn cọc và bồi thường 100% nếu chủ xe hủy chuyến trong vòng 7 ngày trước chuyến đi.',
  },
  {
    id: '2',
    image: PaperWork,
    title: 'Thủ tục đơn giản',
    description: 'Chỉ cần có CCCD gắn chip (hoặc Passport) & Giấy phép lái xe bạn đã đủ điều kiện thuê xe trên Mioto',
  },
  {
    id: '3',
    image: Delivery,
    title: 'Giao xe tận nơi',
    description: 'Bạn có thể lựa chọn giao xe đến nơi bạn muốn....phí tiết kiệm chỉ từ 15k/km',
  },
  {
    id:'4',
    image: EasyPay,
    title:'Thanh toán dễ dàng',
    description:'Thanh toán dễ dàng bằng cách quét QR'
  },
  {
    id:'5',
    image: MultiCar,
    title:'Đa dạng dòng xe ',
    description:'Hơn 100 dòng xe cho bạn tùy ý lựa chọn: Mini, Sedan, CUV, SUV , MPV , Bán tải.'
  },
];

function HeartIcon({ navigation }) {
  const handleHeartPress = () => {
    navigation.navigate('FavoriteCarsScreen', { showHeader: true, showBackButton: true, showTitle: true, screenTitle: "Xe yêu thích" });
  };

  return (
    <Pressable onPress={handleHeartPress}>
      <Ionicons
        name={"heart-outline"}
        size={24}
        color={"black"}
        style={styles.icon}
      />
    </Pressable>
  );
}

function GiftIcon({ navigation }) {
  const handleGiftPress = () => {
    navigation.navigate('GiftScreen', { showHeader: true, showBackButton: true, showTitle: true, screenTitle: "Quà tặng" });
  };

  return (
    <Pressable onPress={handleGiftPress}>
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
  const flatListRef = useRef(null);

  const onScroll = useRef((event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / cardFullWidth);
    setCurrentIndex(index);
  }).current;

  const onMomentumScrollEnd = useRef((event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / cardFullWidth);
    if (index >= promotions.length - 1) {
      flatListRef.current.scrollToIndex({ index: promotions.length - 1, animated: false });
    }
  }).current;

  return (
    <View style={styles.promotionListContainer}>
      <FlatList
        ref={flatListRef}
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
        horizontal
        contentContainerStyle={[
          styles.promotionList,
          Platform.OS === 'android' && { marginLeft: 16 },
        ]}
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardFullWidth}
        decelerationRate="fast"
        snapToAlignment="start"
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={Platform.OS === "android" ? onMomentumScrollEnd : null}
        overScrollMode="never"
        contentInset={{
          up: 0,
          down: 0,
          left: 0,
          right: width - cardWidth - cardSpacing * 2,
        }}
        contentInsetAdjustmentBehavior="automatic"
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

function CarCardList({ carList, navigation }) {
  const normalWidth = width * 0.9;
  const oneItemWidth = width * 0.92;
  const gap = 16;

  const adjustedWidth = carList.length !== 1 ? normalWidth : oneItemWidth;

  return (
    <View style={styles.carCardContainer}>
      <FlatList
        data={carList}
        horizontal
        renderItem={({ item, index }) => (
          <View
            style={{
              paddingLeft: index === 0 ? 16 : gap / 2,
              marginTop: 10,
              marginBottom: 5,
              paddingRight: index === carList.length - 1 ? 16 : gap / 2,
              width: adjustedWidth,
            }}
          >
            <CarCard carInfo={item} navigation={navigation} />
          </View>
        )}
        showsHorizontalScrollIndicator={false}
        snapToInterval={adjustedWidth + gap}
        snapToAlignment="center"
        decelerationRate="fast"
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const BenefitsList = () => {
  const normalWidth = 350;
  const gap = 9;

  const renderItem = ({ item }) => (
    <BenefitsCard 
      image={item.image}
      title={item.title}
      description={item.description}
    />
  );

  return (
    <View style={styles.benefitContainer}>
      <FlatList
        data={benefitsData}
        horizontal
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={normalWidth + gap}
        snapToAlignment="start"
        decelerationRate="fast"
        ListFooterComponent={<View style={{ width: 18 }} />}
      />
    </View>
  );
};

export default function HomeScreen({ navigation }) {
  const placeholderImage = require("../assets/placeholder.png");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.loggedIn.isLoggedIn);
  const user = useSelector((state) => state.loggedIn.user);
  const carList = useSelector((state) => state.carsList.carForYou);
  const carStatus = useSelector((state) => state.carsList.status);
  const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[j[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
  const imageUri = user?.avatarUrl || placeholderImage;

  useEffect(() => {
    // Call fetchCarForYou with user.id or null if user is not defined
    dispatch(fetchCarForYou(user ? user.id : null));
  }, [user, dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(fetchCarForYou(user ? user.id : null));
    setRefreshing(false);
  };

  if (carStatus === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          style={styles.refresh}
          refreshing={refreshing}
          progressViewOffset={60}
          enabled={true}
          onRefresh={onRefresh}
          tintColor="#03a9f4"
          colors={["#03a9f4"]}
        />
      }
    >
      <View style={styles.headerHome}>
        <Image
          source={imageUri}
          style={styles.headerImage}
          contentFit='cover'
          cachePolicy="disk"
          placeholder={blurhash}
        />  
        {isLoggedIn ? <Text style={styles.headerText}>{user?.fullName}</Text> :<Text style={styles.headerText}>Xin chào </Text>}
        <View style={styles.iconContainer}>
          {isLoggedIn ? <HeartIcon navigation={navigation} /> : null }
          {isLoggedIn ? <View style={styles.verticalSeparator} /> : null }
          {isLoggedIn ? <GiftIcon navigation={navigation} /> : null }
        </View>
      </View>
      <SearchBox navigation={navigation} />
      <Text style={styles.promotionText}>Chương trình khuyến mãi</Text>
      <FlatListForPromotion setCurrentIndex={setCurrentIndex} />
      <DotIndex currentIndex={currentIndex} />
      <Text style={styles.carCardListText}>Xe dành cho bạn</Text>
      <CarCardList carList={carList} navigation={navigation} />
      <Text style={styles.carCardListText}>Ưu điểm của LKRental</Text>
      <BenefitsList />
      <Text style={styles.carCardListText}>Đăng ký cho thuê xe</Text>
      <ImageCard
        imageUri="https://img.freepik.com/free-photo/sports-car-driving-asphalt-road-night-generative-ai_188544-8052.jpg"
        title="Bạn muốn cho thuê xe"
        description="Hơn 3,000 chủ xe đang cho thuê hiệu quả trên LKRental. Đăng ký trở thành đối tác của chúng tôi ngay hôm nay để tăng gia tăng thu nhập hàng tháng."
        buttonText="Đăng ký ngay"
        showTitle={true}
        showDescription={true}
        showButton={true}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  refresh: {
    height:10,
    alignItems:"flex-end",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  headerHome: {
    paddingTop:45,
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
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  verticalSeparator: {
    width: 1,
    height: 18,
    backgroundColor: "black",
    marginHorizontal: 10,
  },
  promotionText: {
    marginLeft: 25,
    textAlign: "start",
    fontSize: 18,
    fontWeight: "bold",
    padding: 2,
  },
  promotionListContainer: {
    height: 185,
    flex: 1,
    backgroundColor: "#fff",
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
  benefitContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
  },
});
