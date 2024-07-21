import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { FontAwesome6 } from '@expo/vector-icons';

const UserProfile = ({ carInfo, showStats }) => {

  const placeholderImage = require("../../assets/placeholder.png")
  const { owner } = carInfo;
  const { name, rating, trips, avatar, responseRate, approvalRate, responseTime } = owner;
  const additionalInfoText = "Nhằm bảo mật thông tin cá nhân, LKRental sẽ gửi chi tiết liên hệ của chủ xe sau khi khách hàng hoàn tất bước thanh toán trên ứng dụng.";

  const calculateBadgeLevel = (rating, trips, responseRate, responseTime, approvalRate) => {
    // Example calculations to determine badge level
    const numericRating = parseFloat(rating);
    const numericTrips = parseInt(trips, 10);
    const numericResponseRate = parseInt(responseRate, 10);
    const numericApprovalRate = parseInt(approvalRate, 10);
    const numericResponseTime = parseInt(responseTime, 10);

    const score = (numericRating * 20) + (numericTrips * 5) + (numericResponseRate * 2) + (numericApprovalRate * 2) - (numericResponseTime / 10);

    if (score > 500) {
      return "Cao cấp";
    } else if (score > 300) {
      return "Trung bình";
    } else {
      return "Mới bắt đầu";
    }
  };

  const badgeLevel = calculateBadgeLevel(rating, trips, responseRate, responseTime, approvalRate);

  const generateBadgeText = (badgeLevel) => {
    switch (badgeLevel) {
      case "Cao cấp":
        return "Chủ xe có tỉ lệ phản hồi cao, mức giá cạnh tranh & dịch vụ nhận được nhiều đánh giá tốt từ khách hàng.";
      case "Trung bình":
        return "Chủ xe có dịch vụ khá tốt, giá cả hợp lý và được khách hàng tin tưởng.";
      case "Mới bắt đầu":
        return "Chủ xe mới tham gia, cần thêm thời gian để khẳng định dịch vụ.";
      default:
        return "";
    }
  };

  const badgeText = generateBadgeText(badgeLevel);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Chủ xe</Text>
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.profileHeader}>
        <Image
            source={avatar ? avatar : placeholderImage}
            style={styles.profileImage}
            contentFit="cover"
            transition={1000}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.userName}>{name}</Text>
            <View style={styles.ratingContainer}>
              <FontAwesome6 name="star" size={16} color="gold" />
              <Text style={styles.ratingText}>{rating}</Text>
              <FontAwesome6 name="suitcase" size={16} color="#03A9F4" style={styles.iconSpacing} />
              <Text style={styles.tripsText}>{trips}</Text>
            </View>
          </View>
        </View>
        <FontAwesome6 name="crown" size={14} color="gold" style={styles.crownIcon} />
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>
            {showStats ? badgeText : additionalInfoText}
          </Text>
        </View>
        {showStats && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{responseRate}</Text>
              <Text style={styles.statLabel}>Tỉ lệ phản hồi</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{approvalRate}</Text>
              <Text style={styles.statLabel}>Tỉ lệ đồng ý</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{responseTime}</Text>
              <Text style={styles.statLabel}>Phản hồi trong</Text>
            </View>
          </View>
        )}
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.19,
    shadowRadius: 2.3,
    // Elevation for Android
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  crownIcon: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginLeft: 24,
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
