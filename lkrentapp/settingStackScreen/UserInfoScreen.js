import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function UserInfoScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Tài khoản của tôi</Text>
        <FontAwesome5 name="pencil-alt" size={20} color="#666" style={styles.pencilIcon} />
      </View>
      <Image
        source={{
          uri: "https://cdn.idntimes.com/content-images/community/2022/03/1714382190-93512ef73cc9128141b72669a922c6ee-f48b234e3eecffd2d897cd799c3043de.jpg",
        }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.username}>LKRENTAL</Text>
      <Text style={styles.registerTime}>Ngày tham gia: 1/1/2024</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <FontAwesome5 name="suitcase-rolling" size={24} color="#03a9f4" />
          <Text style={styles.infoText}>0 chuyến</Text>
        </View>
        <View style={styles.infoBox}>
          <FontAwesome5 name="award" size={24} color="yellow" />
          <Text style={styles.infoText}>0 điểm</Text>
        </View>
      </View>

      {/* First row of extra information */}
      <View style={styles.extraInfoContainer}>
        <Text style={styles.extraInfoTextLeft}>Giấy phép lái xe</Text>
        <View style={styles.extraInfoBoxContainer}>
          <View style={[styles.extraInfoBox, styles.extraInfoBoxBackground, styles.extraInfoBoxOrange]}>
            <FontAwesome5 name="exclamation-circle" size={20} color="orange" style={styles.extraInfoIcon} />
            <Text style={styles.extraInfoText}>Chưa xác thực</Text>
          </View>
        </View>
        <Text style={styles.extraInfoTextRight}>Xác thực ngay</Text>
        <FontAwesome5 name="angle-right" color="black" style={styles.angleIcon} />
      </View>

      <View style={styles.middleLine}></View>

      {/* Second row of extra information */}
      <View style={styles.extraInfoContainer}>
        <Text style={styles.extraInfoTextLeft}>Số điện thoại</Text>
        <View style={styles.extraInfoBoxContainer}>
          <View style={[styles.extraInfoBox, styles.extraInfoBoxBackground, styles.extraInfoBoxGreen]}>
            <FontAwesome5 name="check-circle" size={20} color="green" style={styles.extraInfoIcon} />
            <Text style={styles.extraInfoText}>Đã xác thực</Text>
          </View>
        </View>
        <Text style={styles.extraInfoTextRight}>+0123456789</Text>
        <FontAwesome5 name="angle-right" color="black" style={styles.angleIcon} />
      </View>

      <View style={styles.middleLine}></View>

      {/* Third row of extra information */}
      <View style={styles.extraInfoContainer}>
        <Text style={styles.extraInfoTextLeft}>Email</Text>
        <View style={styles.extraInfoBoxContainer}>
          <View style={[styles.extraInfoBox, styles.extraInfoBoxBackground, styles.extraInfoBoxOrange]}>
            <FontAwesome5 name="exclamation-circle" size={20} color="orange" style={styles.extraInfoIcon} />
            <Text style={styles.extraInfoText}>Chưa xác thực</Text>
          </View>
        </View>
        <Text style={styles.extraInfoTextRight}>Xác thực ngay</Text>
        <FontAwesome5 name="angle-right" color="black" style={styles.angleIcon} />
      </View>

      <View style={styles.middleLine}></View>

      {/* Fourth row for Facebook */}
      <View style={styles.extraInfoContainer}>
        <Text style={styles.extraInfoTextLeft}>Facebook</Text>
        <View style={styles.extraInfoBoxContainer}>
          <View style={[styles.extraInfoBox, styles.extraInfoBoxBackground, styles.extraInfoBoxOrange]}>
            <FontAwesome5 name="exclamation-circle" size={20} color="orange" style={styles.extraInfoIcon} />
            <Text style={styles.extraInfoText}>Chưa xác thực</Text>
          </View>
        </View>
        <Text style={styles.extraInfoTextRight}>Liên kết ngay</Text>
        <FontAwesome5 name="angle-right" color="black" style={styles.angleIcon} />
      </View>

      <View style={styles.middleLine}></View>

      {/* Fifth row for Google */}
      <View style={styles.extraInfoContainer}>
        <Text style={styles.extraInfoTextLeft}>Google</Text>
        <View style={styles.extraInfoBoxContainer}>
          <View style={[styles.extraInfoBox, styles.extraInfoBoxBackground, styles.extraInfoBoxOrange]}>
            <FontAwesome5 name="exclamation-circle" size={20} color="orange" style={styles.extraInfoIcon} />
            <Text style={styles.extraInfoText}>Chưa xác thực</Text>
          </View>
        </View>
        <Text style={styles.extraInfoTextRight}>Liên kết ngay</Text>
        <FontAwesome5 name="angle-right" color="black" style={styles.angleIcon} />
      </View>

    </ScrollView>
  );
}

const deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingEnd: 20,
    paddingStart: 20,
    paddingTop: 80, // Add some padding to push the title more towards the top
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute', // Absolute positioning
    top: 20, // Position near the top
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#03a9f4',
    textAlign: 'center',
  },
  pencilIcon: {
    position: 'absolute',
    right: 20, // Position the icon to the right
    fontSize: 20,
    color: '#666',
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: "#01579b",
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  registerTime: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F6F6F6',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  extraInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  extraInfoBoxContainer: {
    flex: 1,
    alignItems: 'center',
  },
  extraInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 20,
    paddingVertical: 5,
    marginLeft: 5,
  },
  extraInfoBoxBackground: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  extraInfoBoxOrange: {
    backgroundColor: 'rgba(255, 165, 0, 0.3)',
  },
  extraInfoBoxGreen: {
    backgroundColor: 'rgba(0, 128, 0, 0.3)',
  },
  extraInfoIcon: {
    marginRight: 5,
  },
  extraInfoText: {
    fontSize: 14,
  },
  extraInfoTextLeft: {
    flex: 1,
    textAlign: 'left',
    color: '#666',
  },
  extraInfoTextRight: {
    textAlign: 'right',
    color: '#666',
  },
  angleIcon: {
    marginLeft: 10,
  },
  middleLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
});
