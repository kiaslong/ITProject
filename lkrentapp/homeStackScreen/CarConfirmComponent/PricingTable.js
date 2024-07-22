import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PricingTable = ({carInfo}) => {
  const [checked, setChecked] = useState('first');

  const formatPrice = (price) => {
    const priceWithZeros = price * 1000; // Add three more zeros
    return priceWithZeros.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bảng tính giá</Text>
      <View style={styles.tableContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Đơn giá thuê <Icon name="information-circle-outline" size={16} color="#03A9F4" /></Text>
          <Text style={styles.value}>{formatPrice(carInfo.oldPrice)} đ/ngày</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalValue}>{formatPrice(carInfo.newPrice)} đ/ngày</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Khuyến mãi</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setChecked('first')}
            >
              <View style={checked === 'first' ? styles.radioButtonChecked : styles.radioButtonUnchecked} />
            </TouchableOpacity>
            <View style={styles.promotionContainer}>
              <Text style={styles.promotionLabel}>Chương trình giảm giá</Text>
              <Text style={styles.promotionDescription}>Giảm 120K trên đơn giá</Text>
            </View>
            <Text style={styles.promotionValue}>-120 000 đ</Text>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setChecked('second')}
            >
              <View style={checked === 'second' ? styles.radioButtonChecked : styles.radioButtonUnchecked} />
            </TouchableOpacity>
            <View style={styles.promotionContainer}>
              <Text style={styles.promotionLabel}>Mã giảm giá</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.finalLabel}>Thành tiền</Text>
          <Text style={styles.finalValue}>888 800 đ</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.row}>
          <Text style={styles.label}>Đặt cọc qua ứng dụng <Icon name="information-circle-outline" size={16} color="#03A9F4" /></Text>
          <Text style={styles.value}>292 800 đ</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Thanh toán khi nhận xe <Icon name="information-circle-outline" size={16} color="#03A9F4" /></Text>
          <Text style={styles.value}>596 000 đ</Text>
        </View>
      </View>
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
});

export default PricingTable;



