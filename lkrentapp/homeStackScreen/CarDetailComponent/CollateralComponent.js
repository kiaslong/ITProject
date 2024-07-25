import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

const CollateralComponent = ({ requireCollateral }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.headerWrapper}>
        <Text style={styles.titleText}>Tài sản thế chấp</Text>
        <FontAwesome6 name="question-circle" size={20} color="#000" />
      </View>
      {requireCollateral ? (
        <>
          <Text style={styles.descriptionText}>
            15 triệu (tiền mặt/chuyển khoản cho chủ xe khi nhận xe)
          </Text>
          <Text style={styles.descriptionText}>
            hoặc Xe máy (kèm cà vẹt gốc) giá trị 15 triệu
          </Text>
        </>
      ) : (
        <Text style={styles.descriptionText}>
          Không yêu cầu tài sản thế chấp
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    backgroundColor: '#fff',
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#03A9F4',
    marginRight: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default CollateralComponent;
