import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

const CompanyInformationScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={require('../assets/lkrentlogo.png')} style={styles.image} />
      <View style={styles.contentContainer}>
        <Text style={styles.contentText}>
          <Text style={styles.boldText}>LKRentApp</Text> là một ứng dụng hàng đầu trong lĩnh vực cho thuê xe tại Việt Nam. Chúng tôi cung cấp một nền tảng tiện lợi và an toàn cho khách hàng để thuê xe với nhiều lựa chọn phù hợp với nhu cầu cá nhân. Với <Text style={styles.boldText}>LKRentApp</Text>, bạn có thể dễ dàng tìm kiếm, đặt xe và thanh toán trực tuyến chỉ trong vài bước đơn giản.
        </Text>
        <Text style={styles.contentText}>
          Chúng tôi cam kết cung cấp dịch vụ chất lượng cao với đội ngũ hỗ trợ khách hàng chuyên nghiệp, sẵn sàng giải đáp mọi thắc mắc của bạn. <Text style={styles.boldText}>LKRentApp</Text> mang đến cho bạn trải nghiệm thuê xe linh hoạt, từ các dòng xe du lịch, xe thể thao đến các dòng xe sang trọng, tất cả đều được kiểm tra và bảo dưỡng định kỳ.
        </Text>
        <Text style={styles.contentText}>
          Bên cạnh đó, <Text style={styles.boldText}>LKRentApp</Text> cũng hỗ trợ các đối tác cho thuê xe dễ dàng quản lý và kinh doanh hiệu quả hơn thông qua các công cụ quản lý thông minh và báo cáo chi tiết.
        </Text>
        <Text style={styles.contentText}>
          Hãy tải ứng dụng <Text style={styles.boldText}>LKRentApp</Text> ngay hôm nay để trải nghiệm dịch vụ thuê xe tuyệt vời và tiện lợi nhất!
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#03a9f4',
  },
  boldText: {
    fontWeight: 'bold',
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  contentContainer: {
    paddingHorizontal: 10,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
    color: '#333',
  },
});

export default CompanyInformationScreen;
