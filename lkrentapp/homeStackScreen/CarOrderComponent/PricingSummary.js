import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Modal,
    TouchableWithoutFeedback,
    Animated,
    Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { height } = Dimensions.get('window');

const PricingSummary = () => {
  const [mainModalVisible, setMainModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [wasMainModalOpen, setWasMainModalOpen] = useState(false);
  const mainModalSlideAnim = useRef(new Animated.Value(height)).current;
  const detailModalSlideAnim = useRef(new Animated.Value(height)).current;
  const paymentModalSlideAnim = useRef(new Animated.Value(height)).current;

  const animateModal = (modalAnim, toValue, duration, callback) => {
    Animated.timing(modalAnim, {
      toValue,
      duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(callback);
  };

  const openMainModal = () => {
    setMainModalVisible(true);
    animateModal(mainModalSlideAnim, 0, 200);
  };

  const closeMainModal = (callback) => {
    animateModal(mainModalSlideAnim, height, 200, () => {
      setMainModalVisible(false);
      if (callback) callback();
    });
  };

  const openDetailModal = () => {
    setWasMainModalOpen(mainModalVisible);
    closeMainModal(() => {
      setDetailModalVisible(true);
      animateModal(detailModalSlideAnim, 0, 200);
    });
  };

  const closeDetailModal = () => {
    animateModal(detailModalSlideAnim, height, 200, () => {
      setDetailModalVisible(false);
      if (wasMainModalOpen) {
        openMainModal();
      }
    });
  };

  const openPaymentModal = () => {
    setWasMainModalOpen(mainModalVisible);
    closeMainModal(() => {
      setPaymentModalVisible(true);
      animateModal(paymentModalSlideAnim, 0, 200);
    });
  };

  const closePaymentModal = () => {
    animateModal(paymentModalSlideAnim, height, 200, () => {
      setPaymentModalVisible(false);
      if (wasMainModalOpen) {
        openMainModal();
      }
    });
  };

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
              <View style={styles.paddingBottom} ></View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const mainModalContent = (
    <>
      <Text style={styles.title}>Bảng tính giá</Text>
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Đơn giá thuê</Text>
          <TouchableOpacity onPress={openDetailModal}>
            <Icon name="help-circle-outline" size={16} color="#000" style={styles.icon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.amount}>803 600 đ/ngày</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Tổng cộng</Text>
        <Text style={styles.amount}>875 700 đ x 1 ngày</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Thành tiền</Text>
        <Text style={styles.amount}>875 700 đ</Text>
      </View>
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Đặt cọc qua ứng dụng</Text>
          <TouchableOpacity onPress={openDetailModal}>
            <Icon name="help-circle-outline" size={16} color="#000" style={styles.icon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.depositAmount}>288 700 đ</Text>
      </View>
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Thanh toán khi nhận xe</Text>
          <TouchableOpacity onPress={openPaymentModal}>
            <Icon name="help-circle-outline" size={16} color="#000" style={styles.icon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.paymentAmount}>587 000 đ</Text>
      </View>
    </>
  );

  const detailModalContent = (
    <>
      <Text style={styles.detailTitle}>Đặt cọc qua ứng dụng</Text>
      <Text style={styles.normalText}>
        - 30% giá trị chuyến đi cần được thanh toán trước qua Mioto để giữ chỗ xe thuê. Số tiền còn lại Khách thuê sẽ thanh toán cho Chủ xe khi làm thủ tục nhận xe.
      </Text>
      <Text style={styles.normalText}>
        - Trường hợp Khách thuê thay đổi ý định thuê xe, xin vui lòng hủy chuyến <Text style={{ fontWeight: 'bold' }}>trong vòng 1h</Text> sau khi giữ chỗ để không bị mất phí.
      </Text>
    </>
  );

  const paymentModalContent = (
    <>
      <Text style={styles.detailTitle}>Thanh toán khi nhận xe</Text>
      <Text style={styles.normalText}>
        - Khách thuê có thể thanh toán 70% giá trị thuê xe bằng Tiền mặt hoặc Chuyển khoản cho Chủ xe khi làm thủ tục nhận xe.
      </Text>
    </>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bảng tính giá</Text>
      <View style={styles.summaryBox}>
        <View style={styles.row}>
          <Text style={styles.label}>Thành tiền</Text>
          <Text style={styles.amount}>970 970đ</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Đặt cọc qua ứng dụng</Text>
            <TouchableOpacity onPress={openDetailModal}>
              <Icon name="help-circle-outline" size={18} color="#000" style={styles.icon} />
            </TouchableOpacity>
          </View>
          <Text style={styles.depositAmount}>319 970đ</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Thanh toán khi nhận xe</Text>
            <TouchableOpacity onPress={openPaymentModal}>
              <Icon name="help-circle-outline" size={18} color="#000" style={styles.icon} />
            </TouchableOpacity>
          </View>
          <Text style={styles.paymentAmount}>651 000đ</Text>
        </View>
        <TouchableOpacity onPress={openMainModal}>
          <Text style={styles.detailText}>Xem chi tiết</Text>
        </TouchableOpacity>
      </View>

      {renderModal(mainModalVisible, mainModalContent, () => closeMainModal(), mainModalSlideAnim)}
      {renderModal(detailModalVisible, detailModalContent, closeDetailModal, detailModalSlideAnim)}
      {renderModal(paymentModalVisible, paymentModalContent, closePaymentModal, paymentModalSlideAnim)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#03A9F4',
  },
  summaryBox: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#000',
  },
  icon: {
    marginLeft: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  depositAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#03A9F4',
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#03A9F4',
  },
  detailText: {
    color: '#03A9F4',
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: height * 0.8,
  },
  button: {
    alignSelf: "flex-start",
    borderRadius: 28,
    padding: 5,
    width: 28,
    height: 28,
    marginBottom:16,
    marginTop:16,
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
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#03A9F4',
  },
  normalText: {
    fontSize: 15,
    marginBottom: 10,
  },
  paddingBottom:{
    paddingBottom:20,
  }
});

export default PricingSummary;
