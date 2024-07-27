import React, { useState, useEffect, useRef,useCallback } from "react";
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
import { getPromotions } from "../store/promotionSlice";
import { getToken } from "../utils/tokenStorage";
import { updateUser } from "../store/loginSlice";
import api from "../api";
import moment from 'moment';
import { debounce } from 'lodash';
import { setCarIds } from "../store/carIdSlice";

const CarLocation = require('../assets/carlocation.jpg');
const PaperWork = require('../assets/paperwork.png');
const Delivery = require('../assets/delivery.png');
const EasyPay = require('../assets/easypay.png');
const MultiCar = require('../assets/multicar.png');

const { width } = Dimensions.get("window");
const cardWidth = width * 1.1;
const cardSpacing = 8;
const cardFullWidth = cardWidth + cardSpacing;

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
  const promotions = useSelector((state) => state.promotions.promotions);

  const validPromotions = promotions.filter(promotion => {
    const now = moment();
    const expirationDate = moment(promotion.expireDate);
    return expirationDate.isAfter(now) && promotion.promotionImageUrl && promotion.makeApply && promotion.modelApply;
  });

  const onScroll = useRef((event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / cardFullWidth);
    setCurrentIndex(index);
  }).current;

  const onMomentumScrollEnd = useRef((event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / cardFullWidth);
    if (index >= validPromotions.length - 1) {
      flatListRef.current.scrollToIndex({ index: validPromotions.length - 1, animated: false });
    }
  }).current;

  return (
    <View style={styles.promotionListContainer}>
      {validPromotions.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={validPromotions}
          renderItem={({ item }) => (
            <View style={[styles.promotionCardWrapper, { width: cardWidth }]}>
              <PromotionCard
                imageUrl={item.promotionImageUrl}
                makeApply={item.makeApply}
                discountText={item.discount}
                modelApply={item.modelApply}
                promoCode={item.promoCode}
                expireDate={item.expireDate}
              />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
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
      ) : (
        <Text style={styles.noPromotionsText}>Hiện tại không có chương trình khuyến mãi nào.</Text>
      )}
    </View>
  );
}

function DotIndex({ currentIndex }) {
  const promotions = useSelector((state) => state.promotions.promotions);
  const validPromotions = promotions.filter(promotion => {
    const now = moment();
    const expirationDate = moment(promotion.expireDate);
    return expirationDate.isAfter(now) && promotion.promotionImageUrl && promotion.makeApply && promotion.modelApply;
  });
  return (
    <View style={styles.dotsContainer}>
      {validPromotions.length > 0 ? (
        validPromotions.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === currentIndex ? "black" : "grey" },
            ]}
          />
        ))
      ) :null}
    </View>
  );
}

function CarCardList({ carList, navigation }) {
  const normalWidth = width * 0.9;
  const oneItemWidth = width * 0.92;
  const gap = 16;

  const promotions = useSelector((state) => state.promotions.promotions);

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
              paddingRight: index === carList.length - 1 ? 16 : gap /2,
              width: adjustedWidth,
            }}
          >
            <CarCard carInfo={item} promotions={promotions} navigation={navigation} />
          </View>
        )}
        showsHorizontalScrollIndicator={false}
        snapToInterval={adjustedWidth }
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
  const promotionsStatus = useSelector((state) => state.promotions.status);
  const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[j[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
  const imageUri = user?.avatarUrl || placeholderImage;
  const carIds = useSelector((state) => state.carIds.carIds);
  

  const fetchOrderHistory = useCallback(async () => {
    if (!user || !user.id) {
      return [];
    }
  
    const token = await getToken();
    try {
      const response = await api.get(`/order/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const orderHistory = response.data;
      const validOrders = orderHistory.filter(order => order.orderState !== 'CANCELED' && order.orderState !== 'COMPLETED');
      const carIds = [...new Set(validOrders.map((order) => order.carId))];
  
      dispatch(setCarIds(carIds)); // Update carIds in Redux state
      return carIds;
    } catch {
      return [];
    }
  }, [user, dispatch]);
  

  useEffect(() => {
    const fetchData = async () => {
      const fetchedCarIds = await fetchOrderHistory();
      dispatch(getPromotions());
      dispatch(fetchCarForYou({ userId: user ? user.id : null, carIds: fetchedCarIds }));
    };

    fetchData();
  }, [user, dispatch, fetchOrderHistory]);

  
 

  

  const onRefresh = async () => {
    setRefreshing(true);
    const token = await getToken();
    const userInfoResponse = await api.get("/auth/info", {
      headers: {
        Authorization: token,
      },
    });
    dispatch(updateUser(userInfoResponse.data));

    const fetchedCarIds = await fetchOrderHistory();
    dispatch(getPromotions());
    dispatch(fetchCarForYou({ userId: user ? user.id : null, carIds: fetchedCarIds }));
    setRefreshing(false);
  };

  const onRefreshHandler = useCallback(debounce(onRefresh, 100), [onRefresh]);

  if (carStatus === 'loading' || promotionsStatus === 'loading') {
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
          onRefresh={onRefreshHandler}
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
        {isLoggedIn ? <Text style={styles.headerText}>{user?.fullName}</Text> : <Text style={styles.headerText}>Xin chào </Text>}
        <View style={styles.iconContainer}>
          {isLoggedIn ? <HeartIcon navigation={navigation} /> : null}
          {isLoggedIn ? <View style={styles.verticalSeparator} /> : null}
          {isLoggedIn ? <GiftIcon navigation={navigation} /> : null}
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
    height: 10,
    alignItems: "flex-end",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  headerHome: {
    paddingTop: 45,
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
    height: 230,
    flex: 1,
    backgroundColor: "#fff",
  },
  promotionList: {
    paddingHorizontal: cardSpacing,
  },
  promotionCardWrapper: {
    borderRadius: 10,
    overflow: "hidden",
    height: 230,
  },
  noPromotionsText: {
    textAlign: "center",
    fontSize: 16,
    color: "grey",
    marginTop: 100,
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
  noPromotionsDotText: {
    textAlign: "center",
    fontSize: 14,
    color: "grey",
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
