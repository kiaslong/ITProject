import React from 'react';
import { View, StyleSheet } from 'react-native';
import SearchBar from './SearchBar';

const SearchBarWrapper = () => {
  return (
    <View style={styles.headerContainer}>
      <SearchBar  onSearch={(text) => console.log(text)} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    height: "100%",
    flex: 1,
  },
});

export default SearchBarWrapper;
