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
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CarCard from "../components/CarCard";
import PromotionCard from "../components/PromotionCard";
import ImageCard from "../components/ImageCard";
import BenefitsCard from "../components/BenefitsCard";
import SearchBox from "../components/SearchBox";
import {  useSelector } from "react-redux";



const CarLocation = require ('../assets/carlocation.jpg')
const PaperWork = require ('../assets/paperwork.png')
const Delivery = require ('../assets/delivery.png')
const EasyPay = require('../assets/easypay.png')
const MultiCar = require ('../assets/multicar.png')





function HeartIcon({navigation}) {
 


  const handleHeartPress = () => {
    navigation.navigate('FavoriteCarsScreen', { showHeader:true,showBackButton: true ,showTitle:true,screenTitle:"Xe yêu thích" });
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
function GiftIcon() {

  const handleGiftPress = () => {
    navigation.navigate('GiftScreen', { showHeader:true,showBackButton: true ,showTitle:true,screenTitle:"Quà tặng" });
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

const { width } = Dimensions.get("window");
const cardWidth =   width * 1.1;
const cardSpacing = 8;
const cardFullWidth = cardWidth + cardSpacing; 

function FlatListForPromotion({ setCurrentIndex }) {

  const flatListRef = useRef(null);

  const onScroll = useRef((event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / cardFullWidth
    );
    setCurrentIndex(index);
  }).current;

  const onMomentumScrollEnd = useRef((event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / cardFullWidth
    );
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
        snapToInterval={ cardFullWidth }
        decelerationRate="fast"
        snapToAlignment="start"
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={Platform.OS==="android" ? onMomentumScrollEnd : null }
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
            <CarCard carsInfo={item} navigation={navigation} />
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
    thumbImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Ow-jdSFfiCijZRPsQz6GQcoF61ahECtZMA&s",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtnh7pgJUtpZWWtHn-eVA3n1DY6D6WpnGOdA&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Ow-jdSFfiCijZRPsQz6GQcoF61ahECtZMA&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Ow-jdSFfiCijZRPsQz6GQcoF61ahECtZMA&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Ow-jdSFfiCijZRPsQz6GQcoF61ahECtZMA&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Ow-jdSFfiCijZRPsQz6GQcoF61ahECtZMA&s"
    ],
    transmission: "Số tự động",
    delivery: "Giao xe tận nơi",
    title:"KIA MORNING 2020",
    location: "Quận Phú Nhuận, Thành Phố Hồ Chí Minh",
    rating: "5.0",
    trips: "97",
    oldPrice: "574K",
    newPrice: "474K",
    discount: "30%",
    supportsDelivery: true,
    specs: {
      transmission: "Số tự động",
      seats: "8 chỗ",
      fuel: "Xăng",
      fuelConsumption: "10l/100km"
    },
    description: "Xe thơm tho, được bảo dưỡng định kỳ, bản đồ vietmap live, cảnh báo tốc độ, cảnh báo camera phạt nguội, có kích bình, bơm hơi, vá vỏ xe, đồ nghề thay vỏ, camera cập lề...",
    features: {
      map: true,
      bluetooth: true,
      sideCamera: true,
      reverseCamera: true,
      collisensor: true,
      gps: true,
      spareTire: true,
      dashCam: true,
      speedAlert: true,
      usbPort: true,
      dvdScreen: true,
      etc: true,
      airbag: true
    }
  },
  {
    id: "2",
    thumbImage:"https://cdni.autocarindia.com/utils/imageresizer.ashx?n=https://cms.haymarketindia.net/model/uploads/modelimages/BMW-2-Series-Gran-Coupe-271220221147.jpg&w=872&h=578&q=75&c=1",
    images: [
      "https://example.com/thumbnail2.jpg",
      "https://example.com/image2-2.jpg",
      "https://example.com/image2-3.jpg",
      "https://example.com/image2-4.jpg",
      "https://example.com/image2-5.jpg"
    ],
    transmission: "Số sàn",
    delivery: "Giao xe tận nơi",
    title: "HYUNDAI I10 2019",
    location: "Quận Đống Đa, Hà Nội",
    rating: "4.8",
    trips: "120",
    oldPrice: "600K",
    newPrice: "500K",
    discount: "20%",
    supportsDelivery: false,
    specs: {
      transmission: "Số sàn",
      seats: "8 chỗ",
      fuel: "Xăng",
      fuelConsumption: "10l/100km"
    },
    description: "Xe thơm tho, được bảo dưỡng định kỳ, bản đồ vietmap live, cảnh báo tốc độ, cảnh báo camera phạt nguội, có kích bình, bơm hơi, vá vỏ xe, đồ nghề thay vỏ, camera cập lề...",
    features: {
      map: true,
      bluetooth: false,
      sideCamera: true,
      reverseCamera: true,
      gps: true,
      spareTire: true,
      dashCam: false,
      speedAlert: true,
      usbPort: false,
      dvdScreen: true,
      etc: false,
      airbag: true
    }
  }
];

const carHistory = [
  {
    id: "1",
    thumbImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Ow-jdSFfiCijZRPsQz6GQcoF61ahECtZMA&s",
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
      "https://example.com/image4.jpg",
      "https://example.com/image5.jpg"
    ],
    transmission: "Số tự động",
    delivery: "Giao xe tận nơi",
    title: "KIA MORNING 2020",
    location: "Quận Phú Nhuận, Thành Phố Hồ Chí Minh",
    rating: "5.0",
    trips: "97",
    oldPrice: "574K",
    newPrice: "474K",
    discount: "30%",
    supportsDelivery: true,
    specs: {
      transmission: "Số tự động",
      seats: "8 chỗ",
      fuel: "Xăng",
      fuelConsumption: "10l/100km"
    },
    description: "Xe thơm tho, được bảo dưỡng định kỳ, bản đồ vietmap live, cảnh báo tốc độ, cảnh báo camera phạt nguội, có kích bình, bơm hơi, vá vỏ xe, đồ nghề thay vỏ, camera cập lề...",
    features: {
      map: true,
      bluetooth: true,
      sideCamera: true,
      reverseCamera: true,
      collisensor: true,
      gps: true,
      spareTire: true,
      dashCam: true,
      speedAlert: true,
      usbPort: true,
      dvdScreen: true,
      etc: true,
      airbag: true
    }
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
    description: 'Chỉ cân có CCCD gắn chip (hoặc Passport) & Giấy phép lái xe bạn đã đủ điều kiện thuê xe trên Mioto',
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



export default function HomeScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isLoggedIn = useSelector((state) => state.loggedIn.isLoggedIn);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerHome}>
        <Image
          source={{
            uri: "https://cdn.idntimes.com/content-images/community/2022/03/1714382190-93512ef73cc9128141b72669a922c6ee-f48b234e3eecffd2d897cd799c3043de.jpg",
          }}
          style={styles.headerImage}
          resizeMode="auto"
        />
        {isLoggedIn ? <Text style={styles.headerText}>Welcome,{"\n"}Phan Phi Long</Text> :<Text style={styles.headerText}>Xin chào </Text> }
        <View style={styles.iconContainer}>
          
          {isLoggedIn ? <HeartIcon navigation={navigation} /> : null }
          {isLoggedIn ? <View style={styles.verticalSeparator} /> : null }
          {isLoggedIn ?  <GiftIcon  navigation={navigation} /> : null }
        </View>
      </View>
      <SearchBox navigation={navigation} />
      <Text style={styles.promotionText}>Chương trình khuyến mãi</Text>
      <FlatListForPromotion setCurrentIndex={setCurrentIndex} />
      <DotIndex currentIndex={currentIndex} />
      <Text style={styles.carCardListText}>Xe dành cho bạn</Text>
      <CarCardList carList={carForYou} navigation={navigation} />
      <Text style={styles.carCardListText}>Xe đã xem</Text>
      <CarCardList carList={carHistory} navigation={navigation} />
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
    flex:1,
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
    paddingTop:10,
  },
});
