import React from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';


const UserProfile = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Chủ xe</Text>
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImage}>
          <Image source={{ uri: 'https://cdn.idntimes.com/content-images/community/2022/03/1714382190-93512ef73cc9128141b72669a922c6ee-f48b234e3eecffd2d897cd799c3043de.jpg' }} style={styles.profileImage} />
          </View>
          <View style={styles.profileDetails}>
            <Text style={styles.userName}>My.</Text>
            <View style={styles.ratingContainer}>
              <FontAwesome6 name="star" size={16} color="gold" />
              <Text style={styles.ratingText}>5.0</Text>
              <FontAwesome6 name="car" size={16} color="#03A9F4" style={styles.iconSpacing} />
              <Text style={styles.tripsText}>21 chuyến</Text>
            </View>
          </View>
        </View>
        <View style={styles.badgeContainer}>
          <FontAwesome6 name="crown" size={24} color="gold" />
          <Text style={styles.badgeText}>
            Chủ xe 5* có thời gian phản hồi nhanh chóng, tỉ lệ đồng ý cao, mức giá cạnh tranh & dịch vụ nhận được nhiều đánh giá tốt từ khách hàng.
          </Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>100%</Text>
            <Text style={styles.statLabel}>Tỉ lệ phản hồi</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>87%</Text>
            <Text style={styles.statLabel}>Tỉ lệ đồng ý</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5 phút</Text>
            <Text style={styles.statLabel}>Phản hồi trong</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    color: "#03A9F4",
    fontWeight: 'bold',
  },
  profileContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2.5},
    shadowOpacity: 0.25,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    color: "#03A9F4",
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
  },
  tripsText: {
    marginLeft: 4,
    fontSize: 14,
  },
  iconSpacing: {
    marginLeft: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#e0f7fa',
    padding: 8,
    borderRadius: 8,
  },
  badgeText: {
    marginLeft: 8,
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
  },
});

export default UserProfile;
