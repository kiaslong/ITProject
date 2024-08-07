import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Easing,
  TouchableWithoutFeedback,
  Vibration,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useSelector, useDispatch } from "react-redux";
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
import Icon from "react-native-vector-icons/Ionicons";
import { setSelectedPromo } from "../store/priceSlice"; // Adjust import path accordingly
import {
  setIsConfirmed,
  setPickupMethod,
  setCarLocation,
  setUserLocation,
  setDeliveryLocation,
} from "../store/locationSlice";
import { getToken } from "../utils/tokenStorage";
import useInterval from "../utils/interval";
import api from "../api";
import { setMessage } from "../store/messageSlice";

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
  const pickupMethod = useSelector((state) => state.location.pickupMethod);
  const [deliveryTapped, setDeliveryTapped] = useState(false);
  const dispatch = useDispatch();
  const time = useSelector((state) => state.time.time);
  const deliveryLocation = useSelector(
    (state) => state.location.deliveryLocation
  );
  
  const isConfirmed = useSelector((state) => state.location.isConfirmed);
  const [orders, setOrders] = useState([]);
  const [carUnavailableMessage, setCarUnavailableMessage] = useState("");
  const user = useSelector((state) => state.loggedIn.user);

  const handleTimePress = () => {
    navigation.navigate("TimePicker", {
      showHeader: true,
      showBackButton: true,
      showTitle: true,
      screenTitle: "Thời gian",
    });
  };

  useEffect(() => {
    if (!isConfirmed) {
      dispatch(setDeliveryLocation(null));
      dispatch(setPickupMethod("self"));
    }
  }, [isConfirmed, dispatch]);

  const fetchOrdersByCarId = useCallback(async () => {
    if (!user) {
      setOrders([]);
      setCarUnavailableMessage("");
      setAuthErrorMessage("");
      return;
    }
    const token = await getToken();
    if (!token) {
      setOrders([]);
      setCarUnavailableMessage("");
      setAuthErrorMessage("");
      return;
    }

    try {
      const response = await api.get(`/order/car/${carInfo.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.length === 0) {
        setOrders([]);
        setCarUnavailableMessage("");
      } else {
        setOrders(response.data);

        const completedOrder = response.data.find(
          (order) => order.paymentState === "COMPLETED"
        );

        if (completedOrder) {
          setCarUnavailableMessage(
            `Xe đã được thuê từ ${moment(completedOrder.startRentDate).format(
              "HH:mm, DD/MM"
            )} đến ${moment(completedOrder.endRentDate).format("HH:mm, DD/MM")}`
          );
        } else  {
          setCarUnavailableMessage("");
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setOrders([]);
        setCarUnavailableMessage("");
      } else {
        console.error("Failed to fetch orders by car ID", error);
      }
    }
  }, [carInfo.id]);

  useEffect(() => {
    if (user) {
      fetchOrdersByCarId();
    }
  }, [fetchOrdersByCarId, user]);

  useInterval(() => {
    if (user) {
      fetchOrdersByCarId();
    }
  }, 5000);

  const handleDeliveryPress = () => {
    if (pickupMethod !== "delivery") {
      setPickupMethod("delivery");
      setDeliveryTapped(true);
      dispatch(setPickupMethod("delivery"));
    } else if (deliveryTapped) {
      navigation.navigate("DeliveryLocationScreen", {
        carInfo,
        showHeader: true,
        showBackButton: true,
        showCloseButton: true,
        animationType: "slide_from_bottom",
        showTitle: true,
        screenTitle: "Địa điểm giao nhận",
      });
    }
  };

  const handleSelfPickupPress = () => {
    setPickupMethod("self");
    dispatch(setPickupMethod("self"));
  };

  const currentYear = moment().year();
  const [start, end] = useMemo(
    () =>
      time
        ? time.split(" - ").map((t) => moment(t, "HH:mm, DD/MM"))
        : [null, null],
    [time]
  );

  const trimLocation = (location) => {
    const parts = location.split(",");
    if (parts.length > 2) {
      let part2 = parts[2].trim();
      let part3 = parts[3].trim();
      return [part2, part3].join(", ").trim();
    }
    return location.trim();
  };

  return (
    <View style={styles.details}>
      {carUnavailableMessage ? (
        <View style={styles.unavailableMessageBox}>
          <Text style={styles.unavailableMessage}>{carUnavailableMessage}</Text>
        </View>
      ) : null}
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
          onPress={handleSelfPickupPress}
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
            <Text style={styles.location}>
              {trimLocation(carInfo.location)}
            </Text>
          </View>
          <Text style={styles.freeDelivery}>Miễn phí</Text>
        </TouchableOpacity>
        {carInfo.supportsDelivery ? (
          <TouchableOpacity
            style={[
              styles.locationOption,
              pickupMethod === "delivery" && styles.selectedOption,
            ]}
            onPress={handleDeliveryPress}
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
                {deliveryLocation && isConfirmed === true
                  ? deliveryLocation
                  : "Chủ xe sẽ giao xe đến tận nơi mà bạn chọn"}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={30} color="#007BFF" />
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
        value={`${carInfo.numberOfSeats} chỗ`}
      />
      <CarSpec
        icon="water-outline"
        title="Nhiên liệu"
        value={translateFuelType(carInfo.fuelType)}
      />
      <CarSpec
        icon="speedometer-outline"
        title="Tiêu hao"
        value={`${carInfo.fuelConsumption}l/100km`}
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
          const IconComponent = getIconComponent(feature.library); // Using the function to get the correct icon component
          return (
            <View style={styles.amenity} key={index}>
              <IconComponent name={feature.icon} size={24} color="#03A9F4" />
              <Text style={styles.amenityTitle}>{feature.name}</Text>
            </View>
          );
        })}
        {features.length % 2 !== 0 && <View style={styles.amenity} />}
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
  const user = useSelector((state) => state.loggedIn.user);
  const promotions = useSelector((state) => state.promotions.promotions);
  const selectedPromo = useSelector((state) => state.price.selectedPromo);
  const deliveryPrice = useSelector((state) => state.location.deliveryPrice);
  const pickupMethod = useSelector((state) => state.location.pickupMethod);
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(selectedPromo);
  const [promoCode, setPromoCode] = useState("");
  const [discountModalVisible, setDiscountModalVisible] = useState(false);
  const [allPromotions, setAllPromotions] = useState([]);
  const discountModalSlideAnim = useRef(new Animated.Value(height)).current;
  const [carUnavailableMessage, setCarUnavailableMessage] = useState("");
  const [orders, setOrders] = useState([]);

  let isDrivingLicenseVerified = false;

  if (user && user.drivingLicenseVerified === false) {
    isDrivingLicenseVerified = false;
  } else if (user === null) {
    isDrivingLicenseVerified = false;
  } else {
    isDrivingLicenseVerified = true;
  }

  const fetchOrdersByCarId = useCallback(async () => {
    if (!user) {
      setOrders([]);
      setCarUnavailableMessage("");
      return;
    }

    const token = await getToken();
    if (!token) {
      setOrders([]);
      setCarUnavailableMessage("");
      return;
    }

    try {
      const response = await api.get(`/order/car/${carInfo.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.length === 0) {
        setOrders([]);
        setCarUnavailableMessage("");
      } else {
        setOrders(response.data);

        const completedOrder = response.data.find(
          (order) => order.paymentState === "COMPLETED"
        );
        if (completedOrder) {
          setCarUnavailableMessage(
            `Xe đã được thuê từ ${moment(completedOrder.startRentDate).format(
              "HH:mm, DD/MM"
            )} đến ${moment(completedOrder.endRentDate).format("HH:mm, DD/MM")}`
          );
        } else {
          setCarUnavailableMessage("");
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setOrders([]);
        setCarUnavailableMessage("");
      } else if (error.response && error.response.status === 401) {
        Alert.alert("Unauthorized: Please log in again.");
      } else {
        console.error("Failed to fetch orders by car ID", error);
      }
    }
  }, [carInfo.id, user]);

  useEffect(() => {
    if (user) {
      fetchOrdersByCarId();
    }
  }, [fetchOrdersByCarId, user]);

  const parseTimeString = (timeString) => {
    const [start, end] = timeString.split(" - ");
    const parseDate = (dateString) => {
      const [time, day, date] = dateString.split(" ");
      const [hours, minutes] = time.split(":").map(Number);
      const [dayPart, dayMonth] = date.split("/");
      return new Date(
        2024,
        parseInt(dayMonth, 10) - 1,
        parseInt(dayPart, 10),
        hours,
        minutes
      );
    };
    return {
      start: parseDate(start),
      end: parseDate(end),
    };
  };

  const parsedTime = parseTimeString(time);

  const calculateRentalDurationInDays = (start, end) => {
    const durationInMillis = end - start;
    const durationInDays = durationInMillis / (1000 * 60 * 60 * 24);
    return Math.ceil(durationInDays);
  };

  const calculateTotalPrice = () => {
    const rentalDurationInDays = calculateRentalDurationInDays(
      parsedTime.start,
      parsedTime.end
    );
    let totalPrice = carInfo.price * rentalDurationInDays * 1000; // Convert to VND

    if (carInfo.allowApplyPromo && checked) {
      const selectedPromotion = allPromotions.find(
        (promo) => promo.promoCode === checked
      );
      if (selectedPromotion) {
        const discount = selectedPromotion.discount.includes("%")
          ? Math.round(
              (parseFloat(selectedPromotion.discount) / 100) * totalPrice
            ) // Percentage discount
          : parseInt(selectedPromotion.discount) * 1000; // Fixed discount in thousands
        totalPrice -= discount;
      }
    }

    if (pickupMethod === "delivery" && deliveryPrice) {
      totalPrice += deliveryPrice;
    }

    return totalPrice;
  };

  useEffect(() => {
    const applicablePromotions = promotions.filter(
      (promo) =>
        carInfo.allowApplyPromo &&
        (promo.makeApply || promo.modelApply) &&
        (!promo.makeApply || promo.makeApply === carInfo.make) &&
        (!promo.modelApply || promo.modelApply === carInfo.model) &&
        new Date(promo.expireDate) >= new Date()
    );

    setAllPromotions(applicablePromotions);

    if (selectedPromo) {
      const selectedPromotion = promotions.find(
        (promo) => promo.promoCode === selectedPromo
      );
      if (
        selectedPromotion &&
        !applicablePromotions.some((promo) => promo.promoCode === selectedPromo)
      ) {
        setAllPromotions((prevPromotions) => [
          ...prevPromotions,
          selectedPromotion,
        ]);
      }
      setChecked(selectedPromo);
    }
  }, [selectedPromo, promotions, carInfo]);

  const animateModal = (modalAnim, toValue, duration, callback) => {
    Animated.timing(modalAnim, {
      toValue,
      duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(callback);
  };

  const openDiscountModal = () => {
    setDiscountModalVisible(true);
    animateModal(discountModalSlideAnim, 0, 200);
  };

  const closeDiscountModal = () => {
    if (checked) {
      dispatch(setSelectedPromo(checked));
    }
    animateModal(discountModalSlideAnim, height, 200, () => {
      setDiscountModalVisible(false);
    });
  };

  const handlePromoSelection = (promoCode) => {
    setChecked(promoCode);
    dispatch(setSelectedPromo(promoCode));
  };

  const applyPromoCode = () => {
    const selectedPromotion = promotions.find(
      (promo) =>
        promo.promoCode === promoCode &&
        new Date(promo.expireDate) >= new Date()
    );
    if (selectedPromotion) {
      if (
        !allPromotions.some(
          (promo) => promo.promoCode === selectedPromotion.promoCode
        )
      ) {
        setAllPromotions((prevPromotions) => [
          ...prevPromotions,
          selectedPromotion,
        ]);
        handlePromoSelection(selectedPromotion.promoCode);
        Alert.alert(
          "Thành công",
          `Mã khuyến mãi "${selectedPromotion.promoCode}" đã được áp dụng thành công.`,
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Thông báo",
          "Mã khuyến mãi này đã được áp dụng trước đó.",
          [{ text: "OK" }]
        );
      }
    } else {
      Alert.alert(
        "Lỗi",
        "Mã khuyến mãi không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại.",
        [{ text: "OK" }]
      );
    }
    setPromoCode("");
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleConfirmPress = async () => {
    if (!user) {
      Alert.alert("Thông báo", "Vui lòng đăng nhập để tiếp tục.");
      return;
    }

    await fetchOrdersByCarId();

    if (carUnavailableMessage) {
      Alert.alert("Thông báo", carUnavailableMessage);
      return;
    }

    if (isDrivingLicenseVerified) {
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
    } else {
      Alert.alert(
        "Thông báo",
        "Vui lòng xác minh giấy phép lái xe trước khi đặt xe."
      );
    }
  };

  const discountModalContent = (
    <>
      <Text style={styles.sectionHeader}>Khuyến mãi</Text>
      {allPromotions.map((promo) => (
        <View key={promo.promoCode} style={styles.row}>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => handlePromoSelection(promo.promoCode)}
          >
            <View
              style={
                checked === promo.promoCode
                  ? styles.radioButtonChecked
                  : styles.radioButtonUnchecked
              }
            />
          </TouchableOpacity>
          <View style={styles.promotionContainer}>
            <Text style={styles.promotionLabel}>{promo.promoCode}</Text>
            <Text style={styles.promotionDescription}>
              {promo.discount.includes("%")
                ? `Giảm ${promo.discount} trên tổng tiền`
                : `Giảm ${formatPrice(promo.discount * 1000)} đ trên tổng tiền`}
            </Text>
          </View>
          <Text style={styles.promotionValue}>
            {promo.discount.includes("%")
              ? `-${promo.discount}`
              : `-${formatPrice(promo.discount * 1000)} đ`}
          </Text>
        </View>
      ))}
      <View style={styles.promoCodeContainer}>
        <TextInput
          style={styles.promoCodeInput}
          placeholder="Nhập mã khuyến mãi"
          value={promoCode}
          onChangeText={setPromoCode}
        />
        <TouchableOpacity style={styles.applyButton} onPress={applyPromoCode}>
          <Text style={styles.applyButtonText}>Áp dụng</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={closeDiscountModal}
      >
        <Text style={styles.confirmButtonText}>Xác nhận</Text>
      </TouchableOpacity>
    </>
  );

  const renderModal = (visible, content, closeModal, modalAnim) => (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={closeModal}
      animationType="none"
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContent,
                { transform: [{ translateY: modalAnim }] },
              ]}
            >
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={closeModal}
              >
                <Text style={styles.textStyle}>X</Text>
              </TouchableOpacity>
              {content}
              <View style={styles.paddingBottom}></View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <View style={styles.bookContainer}>
      {carUnavailableMessage ? (
        <View style={styles.unavailableMessageBox}>
          <Text style={styles.unavailableMessage}>{carUnavailableMessage}</Text>
        </View>
      ) : null}
      <View style={styles.bookContainerRow}>
        <View style={styles.priceInfo}>
          <Text style={styles.newPrice}>
            Giá: {formatPrice(carInfo.price * 1000)}₫/ngày
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.totalPrice}>
              Giá tổng: {formatPrice(calculateTotalPrice())}₫
            </Text>
            <TouchableOpacity
              style={styles.iconDiscount}
              onPress={openDiscountModal}
            >
              <Icon name="pricetag-outline" size={24} color="#ffa500" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.bookButton,
            isDrivingLicenseVerified === false && styles.disabledButton,
          ]}
          onPress={handleConfirmPress}
        >
          <Text style={styles.bookButtonText}>Chọn thuê</Text>
        </TouchableOpacity>
      </View>

      {renderModal(
        discountModalVisible,
        discountModalContent,
        closeDiscountModal,
        discountModalSlideAnim
      )}
    </View>
  );
};

const CarDetailScreen = ({ route, navigation }) => {
  const { carInfo } = route.params;
  
  const dispatch = useDispatch();
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [shouldNavigateBack, setShouldNavigateBack] = useState(false);
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
    {
      useNativeDriver: true,
      listener: (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY < -120 && !shouldNavigateBack) {
          Vibration.vibrate(4);
          setShouldNavigateBack(true);
        }
      },
    }
  );

  const handleScrollEndDrag = () => {
    if (shouldNavigateBack) {
      navigation.goBack();
      dispatch(setIsConfirmed(false));
      dispatch(setCarLocation(null));
      dispatch(setPickupMethod("self"));
      dispatch(setUserLocation(null));
    }
  };

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
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
              dispatch(setIsConfirmed(false));
              dispatch(setCarLocation(null));
              dispatch(setPickupMethod("self"));
              dispatch(setUserLocation(null));
              dispatch(setMessage(''))
            }}
          >
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
        onScrollEndDrag={handleScrollEndDrag}
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
              onPress={() => {
                navigation.goBack();
                dispatch(setIsConfirmed(false));
                dispatch(setCarLocation(null));
                dispatch(setPickupMethod("self"));
                dispatch(setUserLocation(null));
                dispatch(setMessage(''))
              }}
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
        <CollateralComponent requireCollateral={carInfo.requireCollateral} />
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
    marginBottom: 24,
  },
  bookContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  bookButton: {
    marginLeft:30,
    backgroundColor: "#03A9F4",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#757575",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonClose: {
    backgroundColor: "#03A9F4",
    alignSelf: "flex-start",
    marginBottom: 10,
    padding: 5,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#03A9F4",
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  textStyle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#03A9F4",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#03A9F4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  radioButtonChecked: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#03A9F4",
  },
  radioButtonUnchecked: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  promotionContainer: {
    flex: 1,
    flexDirection: "column",
  },
  promotionLabel: {
    fontSize: 16,
  },
  promotionDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  promotionValue: {
    fontSize: 16,
    color: "green",
  },
  promoCodeContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  promoCodeInput: {
    flex: 1,
    borderColor: "#03A9F4",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  applyButton: {
    backgroundColor: "#03A9F4",
    padding: 10,
    borderRadius: 8,
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  iconDiscount: {
    marginLeft: 8,
    marginBottom: 20,
  },
  unavailableMessageBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ffe6e6",
    borderRadius: 8,
    marginBottom: 16,
  },
  unavailableMessage: {
    color: "#cc0000",
    fontSize: 15,
    fontWeight: "bold",
  },
  bookContainerRow:{
    flexDirection:"row"
  }
});

export default CarDetailScreen;
