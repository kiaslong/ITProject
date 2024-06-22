import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { CheckBox } from "@rneui/themed";

const { height, width } = Dimensions.get("window");
const currentYear = new Date().getFullYear();

const featureTitles = {
  banDo: "Bản đồ",
  cuaSoTroi: "Cửa sổ trời",
  bluetooth: "Bluetooth",
  dinhViGPS: "Định vị GPS",
  camera360: "Camera 360",
  gheTreEm: "Ghế trẻ em",
  kheCamUSB: "Khe cắm USB",
  cameraCapLe: "Camera cập lề",
  lopDuPhong: "Lốp dự phòng",
  cameraHanhTrinh: "Camera hành trình",
  manHinhDVD: "Màn hình DVD",
  cameraLui: "Camera lùi",
  cambienLop: "Cảm biến lốp",
  napThungXeBanTai: "Nắp thùng xe bán tải",
  camBienVaCham: "Cảm biến va chạm",
  eTC: "ETC",
  canhBaoTocDo: "Cảnh báo tốc độ",
  tuiKhiAnToan: "Túi khí an toàn",
};

const FilterModal = ({ visible, onClose }) => {
  const [modalVisible, setModalVisible] = useState(visible);
  const slideAnim = useState(new Animated.Value(height))[0];
  const dragY = useState(new Animated.Value(0))[0];
  const initialScrollY = useRef(0);
  const [priceRange, setPriceRange] = useState([500, 2500]);
  const [transmission, setTransmission] = useState("all");
  const [kmLimit, setKmLimit] = useState(100);
  const [distance, setDistance] = useState(100);
  const [seatRange, setSeatRange] = useState([2, 10]);
  const [yearRange, setYearRange] = useState([2005, currentYear]);
  const [limitFee, setLimitFee] = useState(1000);
  const [fuelType, setFuelType] = useState("all");
  const [fuelConsumption, setFuelConsumption] = useState(10);
  const [features, setFeatures] = useState({
    banDo: false,
    cuaSoTroi: false,
    bluetooth: false,
    dinhViGPS: false,
    camera360: false,
    gheTreEm: false,
    kheCamUSB: false,
    cameraCapLe: false,
    lopDuPhong: false,
    cameraHanhTrinh: false,
    manHinhDVD: false,
    cameraLui: false,
    cambienLop: false,
    napThungXeBanTai: false,
    camBienVaCham: false,
    eTC: false,
    canhBaoTocDo: false,
    tuiKhiAnToan: false,
  });

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setModalVisible(false);
      });
    }
  }, [visible, slideAnim]);

  const handleGesture = Animated.event(
    [{ nativeEvent: { translationY: dragY } }],
    { useNativeDriver: false }
  );

  const handleGestureEnd = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      const { translationY } = nativeEvent;
      const threshold = 100;
      if (translationY > threshold) {
        handleOverlayPress();
      }
      dragY.setValue(0);
    }
  };

  const handleOverlayPress = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    initialScrollY.current = scrollY;
  };

  const modalContainerStyle = useMemo(
    () => [styles.modalContent, { height: height * 0.83 }],
    []
  );

  const handlePriceChange = (values) => setPriceRange(values);
  const handleSingleSliderChange = (valueSetter) => (values) => valueSetter(values[0]);
  const handleLimitFeeChange = (values) => setLimitFee(values[0]);
  const handleSeatRangeChange = (values) => setSeatRange(values);
  const handleYearRangeChange = (values) => setYearRange(values);

  const handleFeatureChange = (feature) => {
    setFeatures((prevFeatures) => ({
      ...prevFeatures,
      [feature]: !prevFeatures[feature],
    }));
  };

  const CustomRadioButton = ({ value, selectedValue, onSelect, label }) => (
    <TouchableOpacity
      style={[
        styles.radioContainer,
        selectedValue === value && styles.radioSelected,
      ]}
      onPress={() => onSelect(value)}
    >
      <View style={styles.radioCircle}>
        {selectedValue === value && <View style={styles.radioCheckedCircle} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal transparent={true} visible={modalVisible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleOverlayPress}
        />
        <PanGestureHandler
          onGestureEvent={handleGesture}
          onHandlerStateChange={handleGestureEnd}
        >
          <Animated.View
            style={[
              styles.modalWrapper,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Animated.View style={modalContainerStyle}>
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeIconButton}
              >
                <Ionicons name="close" size={24} color="#03a9f4" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Bộ lọc</Text>
              <TouchableOpacity onPress={null} style={styles.resetButton}>
                <Text style={styles.resetButtonText}>Đặt lại</Text>
              </TouchableOpacity>

              <View style={styles.scrollableContent}>
                <Animated.ScrollView
                  showsVerticalScrollIndicator={false}
                  style={styles.scrollView}
                  scrollEventThrottle={30}
                  onScroll={handleScroll}
                >
                  <TouchableOpacity 
                    onPress={() => console.log("Tối ưu pressed")}
                  >
                    <View style={styles.sortOption}>
                      <Text style={styles.sortLabel}>Sắp xếp theo:</Text>
                      <Text style={styles.sortValue}> Tối ưu </Text>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.separator} />

                  {/* Mức giá */}
                  <View style={styles.filterItem}>
                    <Text style={styles.filterTitle}>Mức giá</Text>
                    <MultiSlider
                      values={priceRange}
                      sliderLength={width * 0.88}
                      onValuesChange={handlePriceChange}
                      min={300}
                      max={3000}
                      step={50}
                      selectedStyle={{
                        backgroundColor: "#03a9f4",
                      }}
                      unselectedStyle={{
                        backgroundColor: "#ddd",
                      }}
                      markerStyle={{
                        height: 18,
                        width: 18,
                        borderRadius: 10,
                        backgroundColor: "#03a9f4",
                      }}
                    />
                    <TouchableOpacity
                      style={styles.limitButton}
                      disabled={true}
                    >
                      <Text>
                        {priceRange[0] === 300
                          ? `Bất kì - ${priceRange[1]}k`
                          : `${priceRange[0]}k - ${priceRange[1]}k`}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.separator} />

                  {/* Truyền động */}
                  <View style={styles.filterItem}>
                    <Text style={styles.filterTitle}>Truyền động</Text>
                    <View style={styles.radioGroup}>
                      <CustomRadioButton
                        value="all"
                        selectedValue={transmission}
                        onSelect={setTransmission}
                        label="Tất cả"
                      />
                      <CustomRadioButton
                        value="manual"
                        selectedValue={transmission}
                        onSelect={setTransmission}
                        label="Số sàn"
                      />
                      <CustomRadioButton
                        value="automatic"
                        selectedValue={transmission}
                        onSelect={setTransmission}
                        label="Số tự động"
                      />
                    </View>
                  </View>

                  <View style={styles.separator} />

                  {/* Giới hạn số km */}
                  <View style={styles.filterItem}>
                    <Text style={styles.filterTitle}>Giới hạn số km</Text>
                    <MultiSlider
                      values={[kmLimit]}
                      sliderLength={width * 0.88}
                      onValuesChange={handleSingleSliderChange(setKmLimit)}
                      min={0}
                      max={550}
                      step={50}
                      selectedStyle={{
                        backgroundColor: "#03a9f4",
                      }}
                      unselectedStyle={{
                        backgroundColor: "#ddd",
                      }}
                      markerStyle={{
                        height: 18,
                        width: 18,
                        borderRadius: 10,
                        backgroundColor: "#03a9f4",
                      }}
                    />
                    <TouchableOpacity
                      style={styles.limitButton}
                      disabled={true}
                    >
                      <Text>
                        {kmLimit === 0
                          ? "Bất kì"
                          : kmLimit === 550
                          ? "Không giới hạn"
                          : `Trên ${kmLimit} km/ngày`}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.separator} />

                  {/* Phí vượt giới hạn */}
                  <View style={styles.filterItem}>
                    <Text style={styles.filterTitle}>Phí vượt giới hạn</Text>
                    <MultiSlider
                      values={[limitFee]}
                      sliderLength={width * 0.88}
                      onValuesChange={handleLimitFeeChange}
                      min={0}
                      max={5}
                      step={1}
                      selectedStyle={{
                        backgroundColor: "#03a9f4",
                      }}
                      unselectedStyle={{
                        backgroundColor: "#ddd",
                      }}
                      markerStyle={{
                        height: 18,
                        width: 18,
                        borderRadius: 10,
                        backgroundColor: "#03a9f4",
                      }}
                    />
                    <TouchableOpacity
                      style={styles.limitButton}
                      disabled={true}
                    >
                      <Text>
                        {limitFee === 5
                          ? "Bất kì"
                          : limitFee === 0
                          ? "Miễn phí "
                          : `Từ dưới ${limitFee}k/km`}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.separator} />

                  {/* Khoảng cách */}
                  <View style={styles.filterItem}>
                    <Text style={styles.filterTitle}>Khoảng cách</Text>
                    <MultiSlider
                      values={[distance]}
                      sliderLength={width * 0.88}
                      onValuesChange={handleSingleSliderChange(setDistance)}
                      min={1}
                      max={50}
                      step={1}
                      selectedStyle={{
                        backgroundColor: "#03a9f4",
                      }}
                      unselectedStyle={{
                        backgroundColor: "#ddd",
                      }}
                      markerStyle={{
                        height: 18,
                        width: 18,
                        borderRadius: 10,
                        backgroundColor: "#03a9f4",
                      }}
                    />
                    <TouchableOpacity
                      style={styles.limitButton}
                      disabled={true}
                    >
                      <Text>
                        {distance === 50 ? "Bất kì" : `${distance} km trở lại `}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.separator} />

                  {/* Số chỗ */}
                  <View style={styles.filterItem}>
                    <Text style={styles.filterTitle}>Số chỗ</Text>
                    <MultiSlider
                      values={seatRange}
                      sliderLength={width * 0.88}
                      onValuesChange={handleSeatRangeChange}
                      min={2}
                      max={10}
                      step={1}
                      selectedStyle={{
                        backgroundColor: "#03a9f4",
                      }}
                      unselectedStyle={{
                        backgroundColor: "#ddd",
                      }}
                      markerStyle={{
                        height: 18,
                        width: 18,
                        borderRadius: 10,
                        backgroundColor: "#03a9f4",
                      }}
                    />
                    <TouchableOpacity
                      style={styles.limitButton}
                      disabled={true}
                    >
                      <Text>{`${seatRange[0]} chỗ - ${seatRange[1]} chỗ`}</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.separator} />

                  {/* Năm sản xuất */}
                  <View style={styles.filterItem}>
                    <Text style={styles.filterTitle}>Năm sản xuất</Text>
                    <MultiSlider
                      values={yearRange}
                      sliderLength={width * 0.88}
                      onValuesChange={handleYearRangeChange}
                      min={2000}
                      max={currentYear}
                      step={1}
                      selectedStyle={{
                        backgroundColor: "#03a9f4",
                      }}
                      unselectedStyle={{
                        backgroundColor: "#ddd",
                      }}
                      markerStyle={{
                        height: 18,
                        width: 18,
                        borderRadius: 10,
                        backgroundColor: "#03a9f4",
                      }}
                    />

                    <TouchableOpacity
                      style={styles.limitButton}
                      disabled={true}
                    >
                      <Text>{`${yearRange[0]} - ${yearRange[1]}`}</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.separator} />

                  {/* Nhiên liệu */}
                  <View style={styles.filterItem}>
                    <Text style={styles.filterTitle}>Nhiên liệu</Text>
                    <View style={styles.radioGroup}>
                      <CustomRadioButton
                        value="all"
                        selectedValue={fuelType}
                        onSelect={setFuelType}
                        label="Tất cả"
                      />
                      <CustomRadioButton
                        value="xang"
                        selectedValue={fuelType}
                        onSelect={setFuelType}
                        label="Xăng"
                      />
                      <CustomRadioButton
                        value="dau"
                        selectedValue={fuelType}
                        onSelect={setFuelType}
                        label="Dầu"
                      />
                      <CustomRadioButton
                        value="dien"
                        selectedValue={fuelType}
                        onSelect={setFuelType}
                        label="Điện"
                      />
                    </View>
                  </View>

                  <View style={styles.separator} />

                  {/* Mức nhiên liệu tiêu thụ */}
                  <View style={styles.filterItem}>
                    <Text style={styles.filterTitle}>
                      Mức nhiên liệu tiêu thụ
                    </Text>
                    <MultiSlider
                      values={[fuelConsumption]}
                      sliderLength={width * 0.88}
                      onValuesChange={handleSingleSliderChange(
                        setFuelConsumption
                      )}
                      min={0}
                      max={30}
                      step={1}
                      selectedStyle={{
                        backgroundColor: "#03a9f4",
                      }}
                      unselectedStyle={{
                        backgroundColor: "#ddd",
                      }}
                      markerStyle={{
                        height: 18,
                        width: 18,
                        borderRadius: 10,
                        backgroundColor: "#03a9f4",
                      }}
                    />
                    <TouchableOpacity
                      style={styles.limitButton}
                      disabled={true}
                    >
                      <Text>
                        {fuelConsumption === 30
                          ? "Bất kì"
                          : `Dưới ${fuelConsumption} l/100km`}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.separator} />

                  {/* Tính năng */}
                  <View style={styles.filterFeature}>
                    <Text style={styles.filterTitleFeature}>Tính năng</Text>
                    <View style={styles.featuresContainer}>
                      {Object.keys(features).map((feature) => (
                        <View key={feature} style={styles.checkboxContainer}>
                          <CheckBox
                            size={18}
                            title={featureTitles[feature]}
                            textStyle={{ fontWeight: "normal" }}
                            checked={features[feature]}
                            onPress={() => handleFeatureChange(feature)}
                            style={styles.checkbox}
                          />
                        </View>
                      ))}
                    </View>
                  </View>
                </Animated.ScrollView>
              </View>
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  modalWrapper: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    position: "absolute",
    bottom: 0,
  },
  modalContent: {
    width: "100%",
    marginTop: 8,
    backgroundColor: "white",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: "hidden",
    flex: 1,
  },
  closeIconButton: {
    position: "absolute",
    top: 4,
    left: 10,
    zIndex: 1,
    padding: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
  modalItem: {
    fontSize: 16,
    padding: 16,
  },
  scrollableContent: {
    marginTop: 24,
    paddingBottom: 50,
  },
  resetButton: {
    position: "absolute",
    top: 4,
    right: 10,
    padding: 7,
    backgroundColor: "red",
    borderRadius: 10,
  },
  resetButtonText: {
    color: "white",
    fontSize: 14,
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 22,
    marginVertical: 10,
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: "400",
  },
  sortValue: {
    fontSize: 16,
    marginLeft: 4,
    fontWeight: "bold",
  },
  filterItem: {
    marginVertical: 10,
    paddingHorizontal: 22,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  radioContainer: {
    marginTop: 10,
    marginLeft: width * 0.05,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioSelected: {
    padding: 8,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#03a9f4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    marginRight: 10,
  },
  radioCheckedCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#03a9f4",
  },
  radioLabel: {
    fontSize: 16,
  },
  limitButton: {
    marginTop: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    alignItems: "center",
  },
  featuresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%", // Two checkboxes per row
  },
  filterFeature: {
    marginVertical: 10,
  },
  filterTitleFeature: {
    paddingLeft: 22,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
    marginHorizontal: width * 0.038,
  },
});

export default FilterModal;
