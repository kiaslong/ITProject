import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { registerFunction, unregisterFunction } from '../store/functionRegistry';
import { Image } from 'expo-image';
import api from '../api';
import { updateUser } from '../store/loginSlice';
import { getToken } from '../utils/tokenStorage';

const UserInfoScreen = () => {
  const placeholderImage = require("../assets/placeholder.png");
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.loggedIn.user);
  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
  const imageUri = user?.avatarUrl || placeholderImage;

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = await getToken();
      try {
        const userInfoResponse = await api.get("/auth/info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(updateUser(userInfoResponse.data));
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    fetchUserInfo();
  }, [dispatch]);

  useEffect(() => {
    const key = 'editUserInfo';
    const onPress = () => navigation.navigate('EditUserInfoScreen', {
      showHeader: true,
      showTitle: true,
      showBackButton: true,
      screenTitle: "Chỉnh sửa",
      showCloseButton: true,
      animationType: "slide_from_bottom",
      user
    });

    registerFunction(key, onPress);

    return () => {
      unregisterFunction(key);
    };
  }, [navigation]);

  const handleLicensePress = () => {
    navigation.navigate('DrivingLicenseScreen', {
      showBackButton: true,
      showCloseButton: true,
      showHeader: true,
      showTitle: true,
      screenTitle: "Giấy tờ xe"
    });
  };

  const handlePhonePress = () => {
    navigation.navigate('PhoneVerificationScreen', {
      showBackButton: true,
      showCloseButton: true,
      showHeader: true,
      showTitle: true,
      screenTitle: "Xác thực SĐT",
      initPhoneNumber: user?.phoneNumber
    });
  };

  const handleEmailPress = () => {
    navigation.navigate('EmailVerificationScreen', {
      showBackButton: true,
      showCloseButton: true,
      showHeader: true,
      showTitle: true,
      screenTitle: "Xác thực Email",
      initEmail: user?.email
    });
  };

  return (
    <View style={styles.safeContainer}>
      <View style={styles.container}>
        <Image
          source={imageUri}
          style={styles.image}
          contentFit='cover'
          cachePolicy="disk"
          placeholder={blurhash}
        />
        <Text style={styles.username}>{user?.fullName || 'LKRENTAL'}</Text>
        <Text style={styles.registerTime}>Ngày tham gia: {new Date(user?.createdAt).toLocaleDateString('vi-VN')}</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <FontAwesome5 name="suitcase-rolling" size={24} color="#03a9f4" />
            <Text style={styles.infoText}>{user?.numberOfSuccessRentals} chuyến</Text>
          </View>
          <View style={styles.infoBox}>
            <FontAwesome5 name="award" size={24} color="yellow" />
            <Text style={styles.infoText}>{user?.rewardPoints} điểm</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.extraInfoContainer} onPress={handleLicensePress}>
          <Text style={styles.extraInfoTextLeft}>Giấy phép lái xe</Text>
          <View style={styles.extraInfoBoxContainer}>
            <View style={[
              styles.extraInfoBox,
              styles.extraInfoBoxBackground,
              user?.drivingLicenseVerified ? styles.extraInfoBoxGreen : styles.extraInfoBoxOrange
            ]}>
              <FontAwesome5
                name={user?.drivingLicenseVerified ? "check-circle" : "exclamation-circle"}
                size={20}
                color={user?.drivingLicenseVerified ? "green" : "orange"}
                style={styles.extraInfoIcon}
              />
              <Text style={styles.extraInfoText}>
                {user?.drivingLicenseVerified ? "Xác thực" : "Chưa xác thực"}
              </Text>
            </View>
          </View>
          <Text style={styles.extraInfoTextRight}> {user?.drivingLicenseVerified ? user?.drivingLicenseNumber : "Chưa xác thực"}</Text>
          <FontAwesome5 name="angle-right" color="black" style={styles.angleIcon} />
        </TouchableOpacity>

        <View style={styles.middleLine}></View>

        <TouchableOpacity style={styles.extraInfoContainer} onPress={handlePhonePress}>
          <Text style={styles.extraInfoTextLeft}>Số điện thoại</Text>
          <View style={styles.extraInfoBoxContainer}>
            <View style={[
              styles.extraInfoBox,
              styles.extraInfoBoxBackground,
              user?.phoneNumberVerified ? styles.extraInfoBoxGreen : styles.extraInfoBoxOrange
            ]}>
              <FontAwesome5
                name={user?.phoneNumberVerified ? "check-circle" : "exclamation-circle"}
                size={20}
                color={user?.phoneNumberVerified ? "green" : "orange"}
                style={styles.extraInfoIcon}
              />
              <Text style={styles.extraInfoText}>
                {user?.phoneNumberVerified ? "Xác thực" : "Chưa xác thực"}
              </Text>
            </View>
          </View>
          <Text style={styles.extraInfoTextRight}>{user?.phoneNumber || '+0123456789'}</Text>
          <FontAwesome5 name="angle-right" color="black" style={styles.angleIcon} />
        </TouchableOpacity>

        <View style={styles.middleLine}></View>

        <TouchableOpacity style={styles.extraInfoContainer} onPress={handleEmailPress}>
          <Text style={styles.extraInfoTextLeft}>Email</Text>
          <View style={styles.extraInfoBoxContainer}>
            <View style={[
              styles.extraInfoBox,
              styles.extraInfoBoxBackground,
              user?.emailVerified ? styles.extraInfoBoxGreen : styles.extraInfoBoxOrange
            ]}>
              <FontAwesome5
                name={user?.emailVerified ? "check-circle" : "exclamation-circle"}
                size={20}
                color={user?.emailVerified ? "green" : "orange"}
                style={styles.extraInfoIcon}
              />
              <Text style={styles.extraInfoText}>
                {user?.emailVerified ? "Xác thực" : "Chưa xác thực"}
              </Text>
            </View>
          </View>
          <Text style={styles.extraInfoTextRight}>{user?.email || 'Xác thực ngay'}</Text>
          <FontAwesome5 name="angle-right" color="black" style={styles.angleIcon} />
        </TouchableOpacity>

        <View style={styles.middleLine}></View>
      </View>
    </View>
  );
};

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingEnd: deviceWidth * 0.05,
    paddingStart: deviceWidth * 0.05,
  },
  iconContainer: {
    position: 'absolute',
    right: deviceWidth * 0.05,
    top: deviceHeight * 0.03,
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
    marginRight: deviceWidth * 0.05
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
    fontSize: deviceHeight * 0.0135,
  },
  extraInfoTextLeft: {
    flex: 1.1,
    textAlign: 'left',
    color: '#666',
    fontSize: deviceHeight * 0.015,
  },
  extraInfoTextRight: {
    flex: 1.2,
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

export default UserInfoScreen;
