import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

const ReviewComponent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Đánh giá</Text>
      <View style={styles.reviewItem}>
      
        <View style={styles.reviewDetails}>
            <View style={styles.userInfoContainer} >
            <Image source={{ uri: 'https://cdn.idntimes.com/content-images/community/2022/03/1714382190-93512ef73cc9128141b72669a922c6ee-f48b234e3eecffd2d897cd799c3043de.jpg' }} style={styles.profileImage} />
                <View style={styles.infoContainer} >
                    <Text style={styles.userName}>NGHIA</Text>
                    <Text style={styles.reviewDate}>23/06/2024</Text>
                </View>
               
            </View>
        
          <Text style={styles.reviewText}>
            Xe sạch sẽ, không mùi, tương đối mới.. Chủ xe thân thiện, nhiệt tình, trang bị đầy đủ tính năng cơ bản để lái xe an toàn..
          </Text>
        </View>
        <FontAwesome6 name="star" size={16} color="gold" />
        <Text style={styles.ratingText}>5</Text>
      </View>
      <View style={styles.reviewItem}>
        <Image source={{ uri: 'https://cdn.idntimes.com/content-images/community/2022/03/1714382190-93512ef73cc9128141b72669a922c6ee-f48b234e3eecffd2d897cd799c3043de.jpg' }} style={styles.profileImage} />
        <View style={styles.reviewDetails}>
          <Text style={styles.userName}>Dương Hữu Đạt</Text>
          <Text style={styles.reviewDate}>21/06/2024</Text>
        </View>
        <FontAwesome6 name="star" size={16} color="gold" />
        <Text style={styles.ratingText}>5</Text>
      </View>
      <View style={styles.buttonContainer}>
      <Button title="Xem thêm" color="#03A9F4" onPress={() => {}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#03A9F4",
    marginBottom: 16,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2.5},
    shadowOpacity: 0.25,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 5,
  },
  userInfoContainer:{
    flexDirection:"row",
    marginBottom:10,
  },
  infoContainer:{
    flexDirection:"column"
  },

  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  reviewDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    color: "#03A9F4",
    fontWeight: 'bold',
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    color: '#333',
  },
  ratingText: {
    fontSize: 16,
    marginLeft: 4,
  },
  buttonContainer: {
    alignItems: 'center',
    borderWidth:1,
    borderRadius:8,
    borderColor:"#03A9F4"
  },
});

export default ReviewComponent;
