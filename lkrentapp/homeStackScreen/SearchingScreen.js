import React, { useState } from 'react';
import { View, StyleSheet,Text } from 'react-native';
import ListOfCar from '../components/ListofCar';


const SearchScreen = ({navigation}) => {

  
  

  return (
    <View style={styles.container}>
      <ListOfCar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:16,
    backgroundColor: '#fff',
  },
});

export default SearchScreen;
