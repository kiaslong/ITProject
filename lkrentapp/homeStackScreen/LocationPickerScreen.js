import React, { useState } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setLocation } from '../store/locationSlice';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareSectionList } from 'react-native-keyboard-aware-scroll-view';

const locations = [
  'Đường Phan Đình Phùng, Phường 15, Quận Phú Nhuận, Thành phố Hồ Chí Minh',
  'Đường Lê Lợi, Quận 1, Thành phố Hồ Chí Minh',
  'Đường Nguyễn Huệ, Quận 1, Thành phố Hồ Chí Minh',
  'Đường Hai Bà Trưng, Quận 3, Thành phố Hồ Chí Minh',
];

const extractStreetName = (location) => {
  const parts = location.split(',');
  return parts[0] || location;
};

export default function LocationPicker({ navigation }) {
  const dispatch = useDispatch();
  const currentLocation = useSelector((state) => state.location.location);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentLocationText, setCurrentLocationText] = useState('Vị trí hiện tại');

  const handleSelectLocation = (location) => {
    setLoading(true);
    setTimeout(() => {
      dispatch(setLocation(location));
      setLoading(false);
      navigation.goBack();
    }, 500); 
  };


  const handleSelectCurrentLocation = () => {
    setCurrentLocationText('Đang xác định vị trí...');
    setTimeout(() => {
      
      const location = '270/100 Phan Đình Phùng P1, Quận Phú Nhuận,TP.HCM'; 
      dispatch(setLocation(location));
      setCurrentLocationText('Vị trí hiện tại');
      navigation.goBack();
    }, 700);
  };

  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(search.toLowerCase())
  );

  return (
      <View style={styles.container}>
        <Text style={styles.containerTitle}>Địa điểm</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="location-outline" size={24} color="black" style={styles.icon} />
          <TextInput
            placeholder="Nhập địa điểm"
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.currentLocationContainer} onPress={handleSelectCurrentLocation}>
          <Ionicons name="location-outline" size={24} color="#03a9f4" />
          <Text style={styles.currentLocationText}>{currentLocationText}</Text>
        </TouchableOpacity>
        <Text style={styles.recentSearchesText}>Tìm kiếm gần đây</Text>
        {loading ? (
          <ActivityIndicator style={styles.loading} size="large" color="#03a9f4" ma/>
        ) : (
          <KeyboardAwareSectionList
            initialNumToRender={5}
            sections={[
              { data: filteredLocations },
            ]}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.item,
                  item === currentLocation && styles.currentLocationHighlight
                ]}
                onPress={() => handleSelectLocation(item)}
              >
                <View style={styles.itemContent}>
                  <View style={styles.titleContainer}>
                    <Ionicons name="location-outline" size={24} color="black" />
                    <Text style={styles.itemTitleText}>{extractStreetName(item)}</Text>
                  </View>
                  <Text style={styles.itemText}>{item}</Text>
                </View>
              </TouchableOpacity>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.recentSearchesText}>{title}</Text>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop:6
  },
  containerTitle:{
    alignSelf:'center',
    fontSize:20,
    fontWeight:'bold',
    marginBottom:14,
    color:'#03a9f4'
  },
  loading:{
    marginTop:30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 14,
    marginBottom: 20,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  currentLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  currentLocationText: {
    marginLeft: 8,
    fontSize: 16,
    color:"#03a9f4",
    fontWeight: 'bold',
  },
  recentSearchesText: {
    fontSize: 16,
    fontWeight: '500',
  },
  item: {
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 8,
  },
  itemContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  itemTitleText: {
    marginLeft: 8,
    fontSize: 17,
    color: '#03a9f4',
    fontWeight: 'bold',
  },
  itemText: {
    fontSize: 15,
    marginLeft: 10,
    color: '#333',
  },
  separator: {
    height: 6,
  },
  currentLocationHighlight: {
    borderColor: '#03a9f4',
    borderWidth: 2,
  },
});
