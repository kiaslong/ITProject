import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function UserInfoScreen() {
  return (
    <View style={styles.safeContainer}>
      <View style={styles.container}>
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
      </View>
    </View>
  );
}

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingEnd: deviceWidth * 0.05,
    paddingStart: deviceWidth * 0.05,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: deviceHeight * 0.03,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#03a9f4',
    textAlign: 'center',
  },
  pencilIcon: {
    position: 'absolute',
    right: deviceWidth * 0.05,
    fontSize: deviceHeight * 0.02,
    color: '#666',
  },
  image: {
    width: deviceWidth * 0.3,
    height: deviceWidth * 0.3,
    borderRadius: deviceWidth * 0.15,
    borderWidth: 2,
    borderColor: "#01579b",
    marginBottom: deviceHeight * 0.03,
  },
  username: {
    fontSize: deviceHeight * 0.03,
    fontWeight: 'bold',
    marginBottom: deviceHeight * 0.01,
  },
  registerTime: {
    fontSize: deviceHeight * 0.02,
    color: '#666',
    marginBottom: deviceHeight * 0.01,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: deviceHeight * 0.02,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F6F6F6',
    borderRadius: 10,
    padding: deviceHeight * 0.01,
    marginHorizontal: deviceWidth * 0.01,
  },
  infoText: {
    fontSize: deviceHeight * 0.018,
    fontWeight: 'bold',
    marginLeft: deviceWidth * 0.01,
  },
  extraInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: deviceHeight * 0.01,
    width: '100%',
  },
  extraInfoBoxContainer: {
    flex: 1,
    alignItems: 'center',
  },
  extraInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: deviceWidth * 0.014,
    borderRadius: 16,
    paddingVertical: deviceHeight * 0.004,
    marginRight: deviceWidth * 0.052
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
    marginRight: deviceWidth * 0.014,
  },
  extraInfoText: {
    fontSize: deviceHeight * 0.014,
  },
  extraInfoTextLeft: {
    flex: 1,
    textAlign: 'left',
    color: '#666',
    fontSize: deviceHeight * 0.015,
  },
  extraInfoTextRight: {
    flex:1,
    textAlign: 'right',
    color: '#666',
    fontSize: deviceHeight * 0.015,
  },
  angleIcon: {
    marginLeft: deviceWidth * 0.02,
  },
  middleLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: deviceHeight * 0.01,
  },
});
