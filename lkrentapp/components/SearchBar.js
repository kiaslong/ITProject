import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const SearchBar = () => {
  const navigation = useNavigation();

  const location = useSelector((state) => state.location.location);
  const time = useSelector((state) => state.time.time);

  return (
    <View style={styles.container}>
     
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => navigation.navigate('ChangeTimeLocation', {
          showHeader:true,
          showBackButton: true,
          showCloseButton: true,
          animationType: "slide_from_bottom",
        })}
      >
        <View style={styles.textContainer}>
          <Text
            style={styles.placeholderBold}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {location}
          </Text>
          <Text style={styles.placeholderRegular}>
            {time}
          </Text>
        </View>
      </TouchableOpacity>
      <Icon name="search" size={24} color="#000" style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginTop: 50,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    position: 'relative',
  },
  icon: {
    marginLeft:5,
    zIndex: 1,
  },
  touchable: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  placeholderBold: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  placeholderRegular: {
    fontSize: 13,
    alignSelf:"center"
  },
});

export default SearchBar;
