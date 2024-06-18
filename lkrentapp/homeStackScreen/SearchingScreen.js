import React, { useState } from 'react';
import { View, StyleSheet,Text } from 'react-native';
import ListOfCar from '../components/ListofCar';


const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Add your search logic here
  };

  return (
    <View style={styles.container}>
      <ListOfCar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:4,
    backgroundColor: '#fff',
  },
});

export default SearchScreen;
