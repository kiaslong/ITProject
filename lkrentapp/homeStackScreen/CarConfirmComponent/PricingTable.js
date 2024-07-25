import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, TouchableWithoutFeedback, Animated, Easing, TextInput, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedPromo } from '../../store/priceSlice'; // Adjust import path accordingly

const { height } = Dimensions.get('window');

const PricingTable = ({ carInfo }) => {
  const time = useSelector((state) => state.time.time);
  const promotions = useSelector((state) => state.promotions.promotions);
  const selectedPromo = useSelector((state) => state.price.selectedPromo);
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(selectedPromo);
  const [promoCode, setPromoCode] = useState('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [allPromotions, setAllPromotions] = useState([]);
  const detailModalSlideAnim = useRef(new Animated.Value(height)).current;
  const depositModalSlideAnim = useRef(new Animated.Value(height)).current;
  const paymentModalSlideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    const applicablePromotions = promotions.filter(promo =>
      (promo.makeApply || promo.modelApply) &&
      (!promo.makeApply || promo.makeApply === carInfo.make) &&
      (!promo.modelApply || promo.modelApply === carInfo.model) &&
      new Date(promo.expireDate) >= new Date()
    );

    setAllPromotions(applicablePromotions);

    if (selectedPromo) {
      const selectedPromotion = promotions.find(promo => promo.promoCode === selectedPromo);
      if (selectedPromotion && !applicablePromotions.some(promo => promo.promoCode === selectedPromo)) {
        setAllPromotions(prevPromotions => [...prevPromotions, selectedPromotion]);
      }
      setChecked(selectedPromo);
    }
  }, [selectedPromo, promotions, carInfo]);

  const parseTimeString = (timeString) => {
    const [start, end] = timeString.split(' - ');
    const parseDate = (dateString) => {
      const [time, day, date] = dateString.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      const [dayPart, dayMonth] = date.split('/');
      return new Date(2024, parseInt(dayMonth, 10) - 1, parseInt(dayPart, 10), hours, minutes);
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
    const rentalDurationInDays = calculateRentalDurationInDays(parsedTime.start, parsedTime.end);
    let totalPrice = carInfo.price * rentalDurationInDays * 1000; // Convert to VND

    if (checked) {
      const selectedPromotion = allPromotions.find(promo => promo.promoCode === checked);
      if (selectedPromotion) {
        const discount = selectedPromotion.discount.includes('%')
          ? Math.round((parseFloat(selectedPromotion.discount) / 100) * totalPrice) // Percentage discount
          : parseInt(selectedPromotion.discount) * 1000; // Fixed discount in thousands
        totalPrice -= discount;
      }
    }

    return totalPrice;
  };

  const calculateDeposit = () => {
    return Math.round(calculateTotalPrice() * 0.30);
  };

  const calculatePaymentOnPickup = () => {
    return Math.round(calculateTotalPrice() - calculateDeposit());
  };

  const animateModal = (modalAnim, toValue, duration, callback) => {
    Animated.timing(modalAnim, {
      toValue,
      duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(callback);
  };

  const openDetailModal = () => {
    setDetailModalVisible(true);
    animateModal(detailModalSlideAnim, 0, 200);
  };

  const closeDetailModal = () => {
    if (checked) {
      dispatch(setSelectedPromo(checked));
    }
    animateModal(detailModalSlideAnim, height, 200, () => {
      setDetailModalVisible(false);
    });
  };

  const openDepositModal = () => {
    setDepositModalVisible(true);
    animateModal(depositModalSlideAnim, 0, 200);
  };

  const closeDepositModal = () => {
    animateModal(depositModalSlideAnim, height, 200, () => {
      setDepositModalVisible(false);
    });
  };

  const openPaymentModal = () => {
    setPaymentModalVisible(true);
    animateModal(paymentModalSlideAnim, 0, 200);
  };

  const closePaymentModal = () => {
    animateModal(paymentModalSlideAnim, height, 200, () => {
      setPaymentModalVisible(false);
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
              <View style={styles.paddingBottom}></View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handlePromoSelection = (promoCode) => {
    setChecked(promoCode);
    dispatch(setSelectedPromo(promoCode));
  };

  const applyPromoCode = () => {
    const selectedPromotion = promotions.find(promo =>
      promo.promoCode === promoCode && new Date(promo.expireDate) >= new Date()
    );
    if (selectedPromotion) {
      if (!allPromotions.some(promo => promo.promoCode === selectedPromotion.promoCode)) {
        setAllPromotions(prevPromotions => [...prevPromotions, selectedPromotion]);
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
    setPromoCode('');
  };

  const detailModalContent = (
    <>
      <Text style={styles.detailTitle}>Đơn giá thuê</Text>
      <Text style={styles.normalText}>
        - Giá thuê xe được tính tròn theo ngày, thời gian thuê xe ít hơn 24 tiếng sẽ được tính tròn 1 ngày.
      </Text>
      <Text style={styles.normalText}>
        - Giá thuê không bao gồm tiền xăng / tiền sạc pin. Khi kết thúc chuyến đi bạn vui lòng đổ xăng, sạc pin về lại mức ban đầu như khi nhận xe, hoặc thanh toán lại chi phí xăng xe/sạc pin cho chủ xe.
      </Text>
      <Text style={styles.normalText}>
        - Giá thuê xe đã bao gồm phí dịch vụ của LKRental. Phí dịch vụ giúp chúng tôi duy trì ứng dụng & triển khai các hoạt động chăm sóc khách hàng một cách chu đáo, nhằm đảm bảo bạn có được chuyến đi an toàn & trải nghiệm tốt nhất cùng LKRental, bao gồm:
      </Text>
      <Text style={styles.normalText}>
        + Dịch vụ tổng đài, chăm sóc & hỗ trợ khách hàng đặt xe.
      </Text>
      <Text style={styles.normalText}>
        + Tìm xe thay thế/ hoàn tiền/ đền tiền nếu chuyến đi bị hủy bởi chủ xe.
      </Text>
      <Text style={styles.normalText}>
        + Tìm xe thay thế/ hoàn tiền nếu bạn thay đổi lịch trình.
      </Text>
      <Text style={styles.normalText}>
        + Hỗ trợ dàn xếp tranh chấp phát sinh với chủ xe (nếu có).
      </Text>
      <Text style={styles.normalText}>
        + Hỗ trợ làm việc với nhà bảo hiểm, garage đối tác khi xảy ra sự cố (nếu có).
      </Text>
      <Text style={styles.normalText}>
        + Và tất cả những vấn đề phát sinh khác trong quá trình thuê xe nếu bạn cần sự hỗ trợ từ chúng tôi.
      </Text>
    </>
  );

  const depositModalContent = (
    <>
      <Text style={styles.detailTitle}>Đặt cọc qua ứng dụng</Text>
      <Text style={styles.normalText}>
        - 30% giá trị chuyến đi cần được thanh toán trước qua LKRental để giữ chỗ xe thuê. Số tiền còn lại Khách thuê sẽ thanh toán cho Chủ xe khi làm thủ tục nhận xe.
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
      <Text style={styles.header}>Bảng tính giá</Text>
      <View style={styles.tableContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Đơn giá thuê <Icon name="information-circle-outline" size={16} color="#03A9F4" onPress={openDetailModal} /></Text>
          <Text style={styles.value}>{formatPrice(carInfo.price * 1000)} đ/ngày</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <Text style={styles.label}>Số ngày thuê:</Text>
          <Text style={styles.value}>{calculateRentalDurationInDays(parsedTime.start, parsedTime.end)} ngày</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Khuyến mãi</Text>
          {allPromotions.map(promo => (
            <View key={promo.promoCode} style={styles.row}>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => handlePromoSelection(promo.promoCode)}
              >
                <View style={checked === promo.promoCode ? styles.radioButtonChecked : styles.radioButtonUnchecked} />
              </TouchableOpacity>
              <View style={styles.promotionContainer}>
                <Text style={styles.promotionLabel}>{promo.promoCode}</Text>
                <Text style={styles.promotionDescription}>
                  {promo.discount.includes('%')
                    ? `Giảm ${promo.discount} trên tổng tiền`
                    : `Giảm ${formatPrice(promo.discount * 1000)} đ trên tổng tiền`}
                </Text>
              </View>
              <Text style={styles.promotionValue}>
                {promo.discount.includes('%')
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
        </View>
        <View style={styles.row}>
          <Text style={styles.finalLabel}>Thành tiền</Text>
          <Text style={styles.finalValue}>{formatPrice(calculateTotalPrice())} đ</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <Text style={styles.label}>Đặt cọc qua ứng dụng <Icon name="information-circle-outline" size={16} color="#03A9F4" onPress={openDepositModal} /></Text>
          <Text style={styles.value}>{formatPrice(calculateDeposit())} đ</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Thanh toán khi nhận xe <Icon name="information-circle-outline" size={16} color="#03A9F4" onPress={openPaymentModal} /></Text>
          <Text style={styles.value}>{formatPrice(calculatePaymentOnPickup())} đ</Text>
        </View>
      </View>

      {renderModal(detailModalVisible, detailModalContent, closeDetailModal, detailModalSlideAnim)}
      {renderModal(depositModalVisible, depositModalContent, closeDepositModal, depositModalSlideAnim)}
      {renderModal(paymentModalVisible, paymentModalContent, closePaymentModal, paymentModalSlideAnim)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  tableContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2.3,
    elevation: 3,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#03A9F4',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  label: {
    fontSize: 16,
    color: '#03A9F4',
  },
  value: {
    fontSize: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginVertical: 10,
    padding: 10,
    borderColor: '#03A9F4',
    borderWidth: 1,
    borderRadius: 10,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#03A9F4',
  },
  promotionContainer: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 5,
  },
  promotionLabel: {
    fontSize: 16,
  },
  promotionDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  promotionValue: {
    fontSize: 16,
    color: 'green',
  },
  finalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#03A9F4',
  },
  finalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#03A9F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioButtonChecked: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#03A9F4',
  },
  radioButtonUnchecked: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 8,
    marginHorizontal: 16,
  },
  promoCodeContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  promoCodeInput: {
    flex: 1,
    borderColor: '#03A9F4',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  applyButton: {
    backgroundColor: '#03A9F4',
    padding: 10,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
    marginBottom: 16,
    marginTop: 16,
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
  paddingBottom: {
    paddingBottom: 20,
  }
});

export default PricingTable;
