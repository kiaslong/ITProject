import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
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
import LocationComponent from "./CarDetailComponent/LocationComponent";
import UserProfile from "./CarDetailComponent/UserProfileDetail";
import ReviewComponent from "./CarDetailComponent/ReviewBox";
import { FontAwesome6 } from "@expo/vector-icons";
import CollateralComponent from "./CarDetailComponent/CollateralComponent";
import TermsComponent from "./CarDetailComponent/TermsComponent";
import ImageView from "./CarDetailComponent/ImageView";
import AdditionalFees from "./CarDetailComponent/AdditionalFees";
import CancellationPolicy from "./CarDetailComponent/CancellationPolicy";

const { width, height } = Dimensions.get("window");

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
  const [start, end] = useMemo(
    () =>
      time
        ? time.split(" - ").map((t) => moment(t, "HH:mm, DD/MM"))
        : [null, null],
    [time]
  );

  return (
    <View style={styles.details}>
      <Text style={styles.smallSectionTitle}>Thời gian thuê xe</Text>
      <View style={styles.timeSection}>
        <TouchableOpacity style={styles.timeBox} onPress={handleTimePress}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeLabel}>Nhận xe</Text>
            <Text numberOfLines={1} style={styles.timeValue}>
              {start
                ? `${start.format("HH:mm")} ${start.format(
                    "dd"
                  )}, ${start.format("DD/MM")}/${currentYear}`
                : ""}
            </Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeLabel}>Trả xe</Text>
            <Text numberOfLines={1} style={styles.timeValue}>
              {end
                ? `${end.format("HH:mm")} ${end.format("dd")}, ${end.format(
                    "DD/MM"
                  )}/${currentYear}`
                : ""}
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
              pickupMethod === "self"
                ? styles.radioButtonSelected
                : styles.radioButton
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
              <Text style={styles.supported}>
                Chủ xe hỗ trợ giao xe tận nơi
              </Text>
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


const translateFuelType = (fuelType) => {
  switch (fuelType) {
    case "Gasoline":
      return "Xăng";
    case "Diesel":
      return "Dầu Diesel";
    case "Electric":
      return "Điện";
    default:
      return fuelType;
  }
};
const CarSpecs = ({ carInfo }) => (
  <View>
    <Text style={styles.bigSectionTitle}>Đặc điểm</Text>
    <View style={styles.featuresContainer}>
      <CarSpec
        icon="car-sport-outline"
        title="Truyền động"
        value={carInfo.transmission === "Số sàn" ? "Số sàn" : "Số tự động"}
      />
      <CarSpec
        icon="people-outline"
        title="Số ghế"
        value={carInfo.numberOfSeats}
      />
      <CarSpec
        icon="water-outline"
        title="Nhiên liệu"
        value={translateFuelType(carInfo.fuelType)}
      />
      <CarSpec
        icon="speedometer-outline"
        title="Tiêu hao"
        value={carInfo.fuelConsumption}
      />
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
  const features = carInfo.features || [];

  return (
    <View>
      <Text style={styles.bigSectionTitle}>Các tiện nghi trên xe</Text>
      <View style={styles.amenitiesContainer}>
        {features.map((feature, index) => {
          const IconComponent = Ionicons; // Default to Ionicons if no library is provided
          return (
            <View style={styles.amenity} key={index}>
              <IconComponent name={feature.icon} size={24} color="#03A9F4" />
              <Text style={styles.amenityTitle}>{feature.name}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export const DocumentComponent = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.headerWrapper}>
        <Text style={styles.titleText}>Giấy tờ thuê xe</Text>
        <FontAwesome6 name="question-circle" size={20} color="#000" />
      </View>
      <Text style={styles.descriptionText}>Chọn 1 trong 2 hình thức:</Text>
      <View style={styles.optionList}>
        <TouchableOpacity style={styles.optionItem} disabled={true}>
          <FontAwesome6 name="passport" size={22} color="#000" />
          <Text style={styles.optionText}>
            {" "}
            GPLX (đối chiếu) & Passport (giữ lại)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem} disabled={true}>
          <FontAwesome6 name="id-card" size={21} color="#000" />
          <Text style={styles.optionText}>
            GPLX (đối chiếu) & CCCD (đối chiếu VNeID)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ConfirmRental = ({ carInfo, navigation }) => {
  const time = useSelector((state) => state.time.time);

  const handleConfirmPress = () => {
    navigation.navigate("CarRentalInfoScreen", {
      carInfo,
      time: time,
      showHeader: true,
      showBackButton: true,
      showTitle: true,
      showCloseButton: true,
      animationType: "slide_from_bottom",
      screenTitle: "Xác nhận đặt xe",
    });
  };

  return (
    <View style={styles.bookContainer}>
      <View style={styles.priceInfo}>
        <Text style={styles.newPrice}>{carInfo.oldPrice}K₫/ngày</Text>
        <Text style={styles.totalPrice}>
          Giá tổng: {carInfo.newPrice}K₫/ngày
        </Text>
      </View>
      <TouchableOpacity style={styles.bookButton} onPress={handleConfirmPress}>
        <Text style={styles.bookButtonText}>Chọn thuê</Text>
      </TouchableOpacity>
    </View>
  );
};

const CarDetailScreen = ({ route, navigation }) => {
  const { carInfo } = route.params;
  const [locationLoaded, setLocationLoaded] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const imageHeight = height * 0.224;

  const headerOpacity = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [imageHeight, imageHeight + 1],
        outputRange: [0, 1],
        extrapolate: "clamp",
      }),
    [scrollY, imageHeight]
  );

  const topIconsTranslateY = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [0, imageHeight],
        outputRange: [0, height * 0.215],
        extrapolate: "clamp",
      }),
    [scrollY, imageHeight]
  );

  const imageScale = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [-imageHeight, 0],
        outputRange: [2, 1],
        extrapolate: "clamp",
      }),
    [scrollY, imageHeight]
  );

  const imageTranslateY = useMemo(
    () =>
      scrollY.interpolate({
        inputRange: [-imageHeight, 0],
        outputRange: [-imageHeight / 2, 0],
        extrapolate: "clamp",
      }),
    [scrollY, imageHeight]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocationLoaded(true);
    }, 600);

    return () => {
      clearTimeout(timer);
      scrollY.setValue(0); // Reset scroll value
    };
  }, [scrollY]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  if (!locationLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#03A9F4" />
      </View>
    );
  }

  return (
    <>
      <Animated.View
        style={[styles.animatedHeader, { opacity: headerOpacity }]}
      >
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
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Animated.View
          style={[
            styles.imageContainer,
            {
              transform: [
                { scale: imageScale },
                { translateY: imageTranslateY },
              ],
              zIndex: 1,
            },
          ]}
        >
          <ImageView
            carInfo={carInfo}
            style={styles.image}
            resizeMode="cover"
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.topIcons,
            {
              transform: [{ translateY: topIconsTranslateY }],
            },
          ]}
        >
          <View styles={styles.leftIcons}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.roundIcon}
              hitSlop={{ top: 50, bottom: 50, left: 50, right: 50 }}
            >
              <Ionicons name="close" size={25} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.rightIcons}>
            <TouchableOpacity
              style={styles.roundIcon}
              hitSlop={{ top: 10, bottom: 5, left: 5, right: 5 }}
            >
              <Ionicons name="share-outline" size={25} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.roundIcon}
              hitSlop={{ top: 10, bottom: 5, left: 5, right: 20 }}
            >
              <Ionicons name="heart-outline" size={25} color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>
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
        <UserProfile carInfo={carInfo} showStats={true} />
        <ReviewComponent />
        <View style={styles.separator} />
        <DocumentComponent />
        <View style={styles.separator} />
        <CollateralComponent />
        <View style={styles.separator} />
        <TermsComponent />
        <View style={styles.separator} />
        <AdditionalFees />
        <CancellationPolicy />
        <View style={styles.separator} />
        <TouchableOpacity style={styles.reportButton}>
          <Ionicons name="flag-outline" size={20} color="#03A9F4" />
          <Text style={styles.reportText}>Báo cáo xe này</Text>
        </TouchableOpacity>
      </Animated.ScrollView>
      <ConfirmRental carInfo={carInfo} navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 120,
  },
  imageContainer: {
    height: height * 0.338,
    overflow: "hidden",
  },
  topIcons: {
    position: "absolute",
    top: 0,
    left: width * 0.027,
    right: width * 0.027,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: height * 0.06,
    zIndex: 20,
  },
  roundIcon: {
    padding: 9,
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
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#03A9F4",
    marginTop: 10,
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
    fontSize: width * 0.037,
    fontWeight: "bold",
  },
  trips: {
    color: "#757575",
    fontSize: width * 0.037,
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
    paddingHorizontal: 17,
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 20,
  },
  animatedHeaderTitle: {
    fontSize: width * 0.045,
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
    marginLeft: 18,
    marginRight: 3,
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

  //document component
  wrapper: {
    padding: 16,
    backgroundColor: "#fff",
  },
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#03A9F4",
    marginRight: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: "#666",
    marginBottom: 6,
  },
  optionList: {
    flexDirection: "column",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 14.2,
    marginLeft: 16,
    alignSelf: "center",
    color: "#333",
  },
  reportButton: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  reportText: {
    fontSize: 18,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginLeft: 8,
    color: "#03A9F4",
  },
});

export default CarDetailScreen;
