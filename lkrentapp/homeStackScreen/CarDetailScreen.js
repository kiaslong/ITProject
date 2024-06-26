import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
 
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useSelector } from "react-redux";
import moment from "moment";
import LocationComponent from "../components/LocationComponent";

const { width, height } = Dimensions.get('window');

const featureIcons = {
  map: { icon: "map-outline", label: "Bản đồ" },
  bluetooth: { icon: "bluetooth-outline", label: "Bluetooth" },
  sideCamera: { icon: "camera-outline", label: "Camera cặp lề" },
  reverseCamera: { icon: "camera-reverse-outline", label: "Camera lùi" },
  gps: { icon: "location-outline", label: "Định vị GPS" },
  spareTire: { icon: "disc-outline", label: "Lốp dự phòng" },
  dashCam: { icon: "camera-outline", label: "Camera hành trình" },
  speedAlert: { icon: "speedometer-outline", label: "Cảnh báo tốc độ" },
  collisensor: { icon: "sensors", label: "Cảm biến va chạm", library: "MaterialIcons" },
  usbPort: { icon: "usb", label: "Khe cắm USB", library: "MaterialCommunityIcons" },
  dvdScreen: { icon: "tv-outline", label: "Màn hình DVD" },
  etc: { icon: "airplane-outline", label: "ETC" },
  airbag: { icon: "shield-checkmark-outline", label: "Túi khí an toàn" },
};

const getIconComponent = (library) => {
  switch (library) {
    case "Ionicons":
      return Ionicons;
    case "MaterialIcons":
      return MaterialIcons;
    case "MaterialCommunityIcons":
      return MaterialCommunityIcons;
    default:
      return Ionicons;
  }
};

const ImageView = ({ carInfo }) => (
  <View>
    <Image source={{ uri: carInfo.image }} style={styles.image} />
  </View>
);

const CarDetails = ({ carInfo, navigation }) => {
  const handleTimePress = () => {
    navigation.navigate("TimePicker", {
      showHeader: true,
      showBackButton: true,
      showTitle: true,
      screenTitle: "Thời gian",
    });
  };

  const [pickupMethod, setPickupMethod] = useState("self");
  const time = useSelector((state) => state.time.time);

  const currentYear = moment().year();
  const [start, end] = time.split(" - ").map((t) => moment(t, "HH:mm, DD/MM"));

  return (
    <View style={styles.details}>
      <Text style={styles.smallSectionTitle}>Thời gian thuê xe</Text>
      <View style={styles.timeSection}>
        <TouchableOpacity style={styles.timeBox} onPress={handleTimePress}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeLabel}>Nhận xe</Text>
            <Text numberOfLines={1} style={styles.timeValue}>
              {start ? `${start.format('HH:mm')} ${start.format('dd')}, ${start.format('DD/MM')}/${currentYear}` : ""}
            </Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeLabel}>Trả xe</Text>
            <Text numberOfLines={1} style={styles.timeValue}>
              {end ? `${end.format('HH:mm')} ${end.format('dd')}, ${end.format('DD/MM')}/${currentYear}` : ""}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.smallSectionTitle}>Địa điểm giao nhận xe</Text>
      <View style={styles.locationSection}>
        <TouchableOpacity
          style={[
            styles.locationOption,
            pickupMethod === "self" && styles.selectedOption,
          ]}
          onPress={() => setPickupMethod("self")}
        >
          <View
            style={
              pickupMethod === "self" ? styles.radioButtonSelected : styles.radioButton
            }
          />
          <View style={styles.locationOptionContainer}>
            <Text style={styles.locationOptionText}>Tôi tự đến lấy xe</Text>
            <Text style={styles.location}>{carInfo.location}</Text>
          </View>
          <Text style={styles.freeDelivery}>Miễn phí</Text>
        </TouchableOpacity>
        {carInfo.supportsDelivery ? (
          <TouchableOpacity
            style={[
              styles.locationOption,
              pickupMethod === "delivery" && styles.selectedOption,
            ]}
            onPress={() => setPickupMethod("delivery")}
          >
            <View
              style={
                pickupMethod === "delivery"
                  ? styles.radioButtonSelected
                  : styles.radioButton
              }
            />
            <View style={styles.locationOptionContainer}>
              <Text style={styles.locationOptionText}>
                Tôi muốn được giao xe tận nơi
              </Text>
              <Text style={styles.supported}>Chủ xe hỗ trợ giao xe tận nơi</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.locationOption,
              pickupMethod === "delivery" && styles.selectedOption,
            ]}
            disabled
          >
            <View style={styles.radioButtonDisabled} />
            <View style={styles.locationOptionContainer}>
              <Text style={styles.locationOptionTextDisabled}>
                Tôi muốn được giao xe tận nơi
              </Text>
              <Text style={styles.notSupported}>
                Rất tiếc, chủ xe không hỗ trợ giao xe tận nơi
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const CarSpecs = ({ carInfo }) => (
  <View>
    <Text style={styles.bigSectionTitle}>Đặc điểm</Text>
    <View style={styles.featuresContainer}>
      <CarSpec icon="car-sport-outline" title="Truyền động" value={carInfo.specs.transmission} />
      <CarSpec icon="people-outline" title="Số ghế" value={carInfo.specs.seats} />
      <CarSpec icon="water-outline" title="Nhiên liệu" value={carInfo.specs.fuel} />
      <CarSpec icon="speedometer-outline" title="Tiêu hao" value={carInfo.specs.fuelConsumption} />
    </View>
  </View>
);

const CarSpec = ({ icon, title, value }) => (
  <View style={styles.feature}>
    <Ionicons name={icon} size={24} color="#03A9F4" />
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureValue}>{value}</Text>
  </View>
);

const CarDescription = ({ carInfo }) => (
  <View>
    <Text style={styles.bigSectionTitle}>Mô tả</Text>
    <View style={styles.carDescription}>
      <Text style={styles.descriptionTitle}>{carInfo.description}</Text>
    </View>
  </View>
);

const CarFeature = ({ carInfo }) => {
  const features = Object.keys(featureIcons).filter((feature) => carInfo.features[feature]);
  if (features.length % 2 !== 0) {
    features.push(null);
  }

  return (
    <View>
      <Text style={styles.bigSectionTitle}>Các tiện nghi trên xe</Text>
      <View style={styles.amenitiesContainer}>
        {features.map((feature, index) => {
          if (feature) {
            const IconComponent = getIconComponent(featureIcons[feature].library);
            return (
              <View style={styles.amenity} key={index}>
                <IconComponent name={featureIcons[feature].icon} size={24} color="#03A9F4" />
                <Text style={styles.amenityTitle}>{featureIcons[feature].label}</Text>
              </View>
            );
          } else {
            return <View style={styles.amenity} key={index}></View>;
          }
        })}
      </View>
    </View>
  );
};

const ConfirmRental = ({ carInfo }) => (
  <View style={styles.bookContainer}>
    <View style={styles.priceInfo}>
      <Text style={styles.newPrice}>{carInfo.newPrice}₫/ngày</Text>
      <Text style={styles.totalPrice}>Giá tổng: 693K</Text>
    </View>
    <TouchableOpacity style={styles.bookButton}>
      <Text style={styles.bookButtonText}>Chọn thuê</Text>
    </TouchableOpacity>
  </View>
);

const CarDetailScreen = ({ route, navigation }) => {
  const { carInfo } = route.params;
  const [locationLoaded, setLocationLoaded] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const imageHeight = height * 0.25;

  const headerOpacity = scrollY.interpolate({
    inputRange: [imageHeight, imageHeight + 10],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const topIconsTranslateY = scrollY.interpolate({
    inputRange: [0, imageHeight],
    outputRange: [0, height * 0.235],
    extrapolate: "clamp",
  });

  useEffect(() => {
    // Simulate fetching location data
    setTimeout(() => {
      setLocationLoaded(true);
    }, 600);
  }, []);

  if (!locationLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#03A9F4" />
      </View>
    );
  }

  return (
    <>
      <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={26} color="black" />
          </TouchableOpacity>
          <Animated.Text style={[styles.animatedHeaderTitle]}>
            {carInfo.title}
          </Animated.Text>
          <View style={styles.rightIcons}>
            <TouchableOpacity>
              <Ionicons name="share-outline" size={26} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="heart-outline" size={26} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View>
          <ImageView carInfo={carInfo} />
          <Animated.View
            style={[
              styles.topIcons,
              {
                transform: [{ translateY: topIconsTranslateY }],
              },
            ]}
          >
            <View styles={styles.leftIcons} >
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.roundIcon}>
              <Ionicons name="close" size={26} color="white" />
            </TouchableOpacity>
            </View>
            <View style={styles.rightIcons}>
              <TouchableOpacity style={styles.roundIcon}>
                <Ionicons name="share-outline" size={26} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.roundIcon}>
                <Ionicons name="heart-outline" size={26} color="white" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
        <Text style={styles.title}>{carInfo.title}</Text>
        <View style={styles.ratingSection}>
          <Text style={styles.rating}>{carInfo.rating} ⭐</Text>
          <Text style={styles.trips}>{carInfo.trips} chuyến</Text>
        </View>
        <CarDetails carInfo={carInfo} navigation={navigation} />
        <View style={styles.separator} />
        <CarSpecs carInfo={carInfo} />
        <View style={styles.separator} />
        <CarDescription carInfo={carInfo} />
        <CarFeature carInfo={carInfo} />
        <Text style={styles.bigSectionTitle}>Vị trí xe</Text>
        <LocationComponent address={carInfo.location} />
      </Animated.ScrollView>
      <ConfirmRental carInfo={carInfo} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 80,
  },
  image: {
    width: "100%",
    height: height * 0.40,
  },
  topIcons: {
    position: "absolute",
    top: 0,
    left: width *0.040,
    right: width *0.040,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop : height * 0.078,
    zIndex: 20,
  },
  roundIcon: {
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 26,
  },
  rightIcons: {
    flexDirection: "row",
    gap: 16,
  },
  details: {
    padding: width * 0.02,
    margin: width * 0.03,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#03A9F4",
    marginBottom: 8,
    marginLeft: 24,
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginLeft: 24,
  },
  rating: {
    marginRight: 16,
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  trips: {
    color: "#757575",
    fontSize: width * 0.04,
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 8,
    marginHorizontal: 16,
  },
  smallSectionTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#03A9F4",
    marginTop: 16,
    marginBottom: 8,
  },
  bigSectionTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#03A9F4",
    marginTop: 16,
    marginLeft: 16,
  },
  timeSection: {
    flexDirection: "row",
  },
  timeBox: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#F9F9F9",
  },
  timeContainer: {
    marginStart: "auto",
    flexDirection: "column",
    marginEnd: "auto",
    justifyContent: "flex-start",
  },
  timeLabel: {
    color: "#757575",
    fontSize: width * 0.04,
  },
  timeValue: {
    marginTop: 10,
    fontSize: width * 0.033,
    fontWeight: "700",
  },
  locationSection: {
    marginBottom: 16,
  },
  locationOption: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "#F9F9F9",
    marginBottom: 8,
  },
  radioButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#03A9F4",
    marginRight: 12,
  },
  radioButtonSelected: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#03A9F4",
    backgroundColor: "#03A9F4",
    marginRight: 12,
  },
  radioButtonDisabled: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#BDBDBD",
    marginRight: 12,
  },
  selectedOption: {
    borderColor: "#03A9F4",
    backgroundColor: "#E3F2FD",
  },
  locationOptionContainer: {
    flex: 1,
    flexDirection: "column",
  },
  locationOptionText: {
    color: "#03A9F4",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  locationOptionTextDisabled: {
    color: "#BDBDBD",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  freeDelivery: {
    position: "absolute",
    top: 12,
    right: 20,
    color: "#03A9F4",
  },
  supported: {
    color: "#03A9F4",
    marginTop: 6,
    fontSize: width * 0.035,
  },
  notSupported: {
    color: "#BDBDBD",
    marginTop: 6,
    fontSize: width * 0.035,
  },
  location: {
    color: "black",
    fontSize: width * 0.04,
    marginTop: 10,
    marginBottom: 4,
  },
  priceSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  oldPrice: {
    textDecorationLine: "line-through",
    color: "#757575",
    fontSize: width * 0.04,
    marginRight: 10,
  },
  newPrice: {
    fontWeight: "bold",
    color: "#03A9F4",
    fontSize: width * 0.05,
  },
  totalPrice: {
    color: "#03A9F4",
    fontSize: width * 0.04,
    marginBottom: 16,
  },
  bookContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  bookButton: {
    backgroundColor: "#03A9F4",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  bookButtonText: {
    color: "white",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  priceInfo: {
    flexDirection: "column",
  },
  animatedHeader: {
    height: 95,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    zIndex: 20,
  },
  headerContent: {
    flex: 1,
    marginTop: 30,
    flexDirection: "row",
    paddingHorizontal: 18,
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 20,
  },
  animatedHeaderTitle: {
    fontSize: width * 0.048,
    fontWeight: "bold",
    color: "#000",
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 3,
    margin: 12,
    elevation: 3,
  },
  feature: {
    alignItems: "center",
  },
  featureTitle: {
    fontSize: width * 0.035,
    color: "#757575",
    marginTop: 8,
  },
  featureValue: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#000",
    marginTop: 6,
  },
  carDescription: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: 12,
  },
  descriptionTitle: {
    fontSize: width * 0.04,
    color: "#757575",
    marginTop: 6,
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 8,
  },
  amenity: {
    width: "45%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    margin: 8,
  },
  amenityTitle: {
    fontSize: width * 0.035,
    color: "#757575",
    textAlign: "center",
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CarDetailScreen;
