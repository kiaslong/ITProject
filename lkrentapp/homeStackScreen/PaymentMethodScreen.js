import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { CommonActions } from "@react-navigation/native";

const { height, width } = Dimensions.get('window');

const PaymentMethodScreen = ({ navigation }) => {
  const [isBankTransferExpanded, setIsBankTransferExpanded] = useState(false);
  const [mainModalVisible, setMainModalVisible] = useState(false);
  const scrollViewRef = useRef(null);
  const bankTransferRef = useRef(null);
  const mainModalSlideAnim = useRef(new Animated.Value(height)).current;

  const toggleBankTransfer = () => {
    setIsBankTransferExpanded(!isBankTransferExpanded);
    setTimeout(() => {
      bankTransferRef.current?.measureLayout(scrollViewRef.current.getScrollResponder().getInnerViewNode(), (x, y) => {
        scrollViewRef.current.scrollTo({ x: 0, y: y, animated: true });
      });
    }, 100);
  };

  const handleBooking = () => {
    setMainModalVisible(true);
    animateModal(mainModalSlideAnim, 0, 200);
    setTimeout(() => {
      setMainModalVisible(false);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Main" }],
        })
      );
      navigation.navigate("Chuyến");
    }, 2000); // Adjust the timeout duration as needed
  };

  const animateModal = (modalAnim, toValue, duration, callback) => {
    Animated.timing(modalAnim, {
      toValue,
      duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(callback);
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
              {content}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const mainModalContent = (
    <View style={styles.modalContent}>
      <Text style={styles.modalText}>Đặt chỗ thành công!</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer} ref={scrollViewRef}>
        <View style={styles.content}>
          <Text style={styles.headerText}>Chọn phương thức thanh toán</Text>
          <Text style={styles.descriptionText}>
            Trường hợp nhiều khách hàng cùng đặt xe tại một thời điểm, hệ thống sẽ ưu tiên khách hàng thanh toán sớm nhất.
          </Text>
          <Text style={styles.descriptionText}>
            Để bảo vệ khoản thanh toán của bạn, tuyệt đối không chuyển tiền hoặc liên lạc bên ngoài trang web hoặc ứng dụng LKRental.
          </Text>
          <Text style={styles.descriptionText}>
            Gọi 0908283821 (7AM - 10PM) hoặc chat với LKRental tại LKRental Fanpage nếu bạn gặp khó khăn trong quá trình thanh toán.
          </Text>
          <TouchableOpacity style={styles.paymentOption} onPress={toggleBankTransfer}>
            <FontAwesome5 name="university" size={24} color="#000" />
            <Text style={styles.paymentOptionText}>Chuyển khoản ngân hàng</Text>
          </TouchableOpacity>
          {isBankTransferExpanded && (
            <View style={styles.bankTransferDetails} ref={bankTransferRef}>
              <Text style={styles.bankTransferText}>1. Bấm ĐẶT CHỖ để xác nhận lựa chọn hình thức Chuyển khoản ngân hàng.</Text>
              <Text style={styles.bankTransferText}>2. Bạn vui lòng chuyển khoản cho LKRental trong vòng 30 phút kể từ lúc đặt chỗ.</Text>
              <View style={styles.bankInfo}>
                <Text style={styles.bankName}>Ngân hàng TPBANK</Text>
                <Text style={styles.bankDetail}>Số tài khoản: 03972919301</Text>
                <Text style={styles.bankDetail}>Chủ tài khoản: PHAN PHI LONG</Text>
                <Text style={styles.bankDetail}>Nội dung chuyển khoản: Tên tài khoản + SĐT</Text>
              </View>
              <Text style={styles.bankTransferText}>3. Chụp lại màn hình Chuyển khoản thành công và gửi đến LKRental fanpage hoặc email contact@lkrental.vn. Sau khi nhận được hình chụp từ bạn hoặc có tin nhắn tiền đã vào tài khoản, LKRental sẽ gửi thông báo đặt cọc thành công và thông tin chủ xe qua tin nhắn SMS, ứng dụng & website LKRental.</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.footerLeft}>
            <FontAwesome5 name="university" size={24} color="#000" />
            <Text style={styles.footerAmount}>319 970 đ</Text>
          </View>
          <TouchableOpacity style={styles.footerButton} onPress={handleBooking}>
            <Text style={styles.footerButtonText}>ĐẶT CHỖ</Text>
          </TouchableOpacity>
        </View>
      </View>
      {renderModal(mainModalVisible, mainModalContent, () => setMainModalVisible(false), mainModalSlideAnim)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingBottom: 100, // Ensure space for the footer
  },
  content: {
    padding: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 16,
  },
  paymentOptionText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#000',
  },
  bankTransferDetails: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  bankTransferText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  bankInfo: {
    padding: 16,
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  bankName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bankDetail: {
    fontSize: 14,
    marginBottom: 4,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  footerLeft: {
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerAmount: {
    marginLeft: 8,
    fontSize: 18,
    color: '#03A9F4',
    fontWeight: 'bold',
  },
  footerButton: {
    padding: 10,
    backgroundColor: '#03A9F4',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  footerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: width * 0.8, // Width relative to screen width
    maxHeight: height * 0.4,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#03A9F4',
  },
  paddingBottom: {
    paddingBottom: 20,
  },
});

export default PaymentMethodScreen;
