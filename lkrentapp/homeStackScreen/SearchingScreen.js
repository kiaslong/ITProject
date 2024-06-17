import React, { useState } from 'react';
import { View, StyleSheet,Text } from 'react-native';


const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Add your search logic here
  };

  return (
    <View style={styles.container}>
        <Text> Hello pl  </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});

export default SearchScreen;
