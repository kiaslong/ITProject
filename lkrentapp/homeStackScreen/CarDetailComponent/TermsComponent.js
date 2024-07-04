import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const TermsComponent = () => {
  const [showMore, setShowMore] = useState(false);

  const handleShowMore = () => {
    setShowMore(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Điều khoản</Text>
      <View style={styles.section}>
        <Text style={styles.header}>Quy định khác:</Text>
        <Text style={styles.text}>○ Sử dụng xe đúng mục đích.</Text>
        <Text style={styles.text}>○ Không sử dụng xe thuê vào mục đích phi pháp, trái pháp luật.</Text>
        <Text style={styles.text}>○ Không sử dụng xe thuê để cầm cố, thế chấp.</Text>
        <Text style={styles.text}>○ Không hút thuốc, nhả kẹo cao su, xả rác trong xe.</Text>
        <Text style={styles.text}>○ Không chở hàng quốc cấm dễ cháy nổ.</Text>

        {showMore && (
          <>
            <Text style={styles.text}>○ Không chở hoa quả, thực phẩm nặng mùi trong xe.</Text>
            <Text style={styles.text}>○ Khi trả xe, nếu xe bẩn hoặc có mùi trong xe, khách hàng vui lòng vệ sinh xe sạch sẽ hoặc gửi phụ thu phí vệ sinh xe.</Text>
            <Text style={styles.footer}>Trân trọng cảm ơn, chúc quý khách hàng có những chuyến đi tuyệt vời !</Text>
          </>
        )}
      </View>
      {!showMore && (
        <TouchableOpacity style={styles.button} onPress={handleShowMore}>
          <Text style={styles.buttonText}>Xem thêm</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#03A9F4",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    marginBottom: 3,
  },
  footer: {
    fontSize: 14.2,
    fontStyle: 'bold',
    marginTop:10
  },
  button: {
    alignItems: 'center',
  },
  buttonText: {
    color: '#03A9F4',
    fontSize: 14.5,
    fontWeight: 'bold',
  },
});

export default TermsComponent;
