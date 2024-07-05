import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const FooterComponent = () => {
  const [isChecked, setIsChecked] = useState(true);

  return (
    <View style={styles.footerContainer}>
      <View style={styles.footerRow}>
        <TouchableOpacity onPress={() => setIsChecked(!isChecked)} style={styles.checkbox}>
          <Icon name={isChecked ? "checkmark-circle" : "ellipse-outline"} size={24} color={isChecked ? "#03A9F4" : "#D1D1D6"} />
        </TouchableOpacity>
        <Text style={styles.footerText}>Tôi đồng ý với </Text>
        <Text style={styles.footerLink}>Chính sách hủy chuyến của LKRental</Text>
      </View>
      <TouchableOpacity style={styles.footerButton}>
        <Text style={styles.footerButtonText}>Gửi yêu cầu thuê xe</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    width: '100%',
    paddingLeft:16,
    paddingRight:16,
    paddingBottom:40,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
  },
  footerRow: {
    paddingVertical:8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkbox: {
    marginRight: 6,
  },
  footerText: {
    fontSize: 13,
  },
  footerLink: {
    fontSize: 12.5,
    color: '#03A9F4',
    textDecorationLine: 'underline',
  },
  footerButton: {
    backgroundColor: '#03A9F4',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FooterComponent;
