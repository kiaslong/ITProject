import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";

const { height } = Dimensions.get("window");

const AdditionalFees = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.header}>Phụ phí có thể phát sinh</Text>

        <View style={styles.section}>
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeader}>Phí vượt giới hạn</Text>
            <Text style={styles.sectionSpec}>4 000đ/km</Text>
          </View>

          <Text style={styles.description}>
            Phụ phí phát sinh nếu lộ trình di chuyển vượt quá{" "}
            <Text style={styles.boldText}>400km</Text> khi thuê xe{" "}
            <Text style={styles.boldText}>1 ngày</Text>
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeader}>Phụ phí khác</Text>
          </View>
          <Text style={styles.description}>
            Phụ phí phát sinh nếu hoàn trả xe trễ, xe không đảm bảo vệ sinh hoặc
            bị ám mùi
          </Text>
        </View>

        <TouchableOpacity style={styles.moreButton} onPress={openModal}>
          <Text style={styles.moreText}>Xem thêm</Text>
        </TouchableOpacity>
      </View>

      <Modal
        hardwareAccelerated
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <Animated.View
                style={[
                  styles.modalView,
                  { transform: [{ translateY: slideAnim }] },
                ]}
              >
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={closeModal}
                >
                  <Text style={styles.textStyle}>X</Text>
                </TouchableOpacity>
                <Text style={styles.modalHeader}>Phụ phí có thể phát sinh</Text>

                <View style={styles.section}>
                  <View style={styles.sectionHeaderContainer}>
                    <Text style={styles.sectionHeader}>Phí vượt giới hạn</Text>
                    <Text style={styles.sectionSpec}>4 000đ/km</Text>
                  </View>

                  <View style={styles.sectionContent}>
                    <Text style={styles.description}>
                      Phụ phí phát sinh nếu lộ trình di chuyển vượt quá{" "}
                      <Text style={styles.boldText}>400km</Text> khi thuê xe{" "}
                      <Text style={styles.boldText}>1 ngày</Text>
                    </Text>
                  </View>
                </View>

                <View style={styles.section}>
                  <View style={styles.sectionHeaderContainer}>
                    <Text style={styles.sectionHeader}>Phí quá giờ</Text>
                    <Text style={styles.sectionSpec}>70 000đ/giờ</Text>
                  </View>
                  <Text style={styles.description}>
                    Phụ phí phát sinh nếu hoàn trả xe trễ giờ. Trường hợp trễ
                    quá <Text style={styles.boldText}>5 giờ</Text>, phụ phí thêm{" "}
                    <Text style={styles.boldText}>1 ngày thuê</Text>
                  </Text>
                </View>

                <View style={styles.section}>
                  <View style={styles.sectionHeaderContainer}>
                    <Text style={styles.sectionHeader}>Phí vệ sinh</Text>
                    <Text style={styles.sectionSpec}>100 000đ</Text>
                  </View>
                  <Text style={styles.description}>
                    Phụ phí phát sinh khi xe hoàn trả không đảm bảo vệ sinh
                    (nhiều vết bẩn, bùn cát, sinh lầy ...)
                  </Text>
                </View>

                <View style={styles.section}>
                  <View style={styles.sectionHeaderContainer}>
                    <Text style={styles.sectionHeader}>Phí khử mùi</Text>
                    <Text style={styles.sectionSpec}>250 000đ</Text>
                  </View>
                  <Text style={styles.description}>
                    Phụ phí phát sinh khi xe hoàn trả bị ám mùi khó chịu (mùi
                    thuốc lá, thực phẩm nặng mùi ...)
                  </Text>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 18,
    color: "#03A9F4",
    fontWeight: "bold",
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionSpec: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    alignSelf: "flex-end",
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionContent: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  boldText: {
    fontWeight: "bold",
    color: "black",
  },
  description: {
    color: "#888",
    marginTop: 4,
  },
  moreButton: {
    marginTop: 8,
  },
  moreText: {
    fontSize: 14.5,
    alignSelf: "center",
    color: "#03A9F4",
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: height,
  },
  button: {
    alignSelf: "flex-start",
    borderRadius: 28,
    padding: 5,
    width: 28,
    height: 28,
    marginBottom: 16,
  },
  buttonClose: {
    backgroundColor: "#03A9F4",
  },
  textStyle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalHeader: {
    fontSize: 18,
    color: "#03A9F4",
    fontWeight: "bold",
    marginBottom: 16,
  },
});

export default AdditionalFees;
