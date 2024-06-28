import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useRoute } from '@react-navigation/native';

const DetailMyAddressesScreen = () => {
  const route = useRoute();
  const { address, showHeader, showTitle, showBackButton, screenTitle, showCloseButton, animationType } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  
  const [addressName, setAddressName] = useState(address?.name || '');
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [detailedAddress, setDetailedAddress] = useState(address?.detailedAddress || '');

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json")
      .then(response => response.json())
      .then(data => {
        setProvinces(data);
        if (address?.province) {
          const province = data.find(p => p.Name === address.province);
          if (province) {
            setSelectedProvince(province.Id);
            setDistricts(province.Districts);
            if (address?.district) {
              const district = province.Districts.find(d => d.Name === address.district);
              if (district) {
                setSelectedDistrict(district.Id);
                setWards(district.Wards);
                if (address?.ward) {
                  const ward = district.Wards.find(w => w.Name === address.ward);
                  if (ward) {
                    setSelectedWard(ward.Id);
                  }
                }
              }
            }
          }
        }
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const handleProvinceChange = (value) => {
    console.log("Selected Province ID:", value);
    const province = provinces.find(p => p.Id === value);
    console.log("Selected Province:", province);
    setSelectedProvince(value);
    setDistricts(province ? province.Districts : []);
    setSelectedDistrict(null);
    setWards([]);
    setSelectedWard(null);
  };

  const handleDistrictChange = (value) => {
    console.log("Selected District ID:", value);
    const district = districts.find(d => d.Id === value);
    console.log("Selected District:", district);
    setSelectedDistrict(value);
    setWards(district ? district.Wards : []);
    setSelectedWard(null);
  };

  const handleWardChange = (value) => {
    console.log("Selected Ward ID:", value);
    setSelectedWard(value);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Tên gợi nhớ</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên cho địa chỉ"
        value={addressName}
        onChangeText={setAddressName}
      />
      <Text style={styles.label}>Tỉnh/Thành phố</Text>
      <RNPickerSelect
        style={pickerSelectStyles}
        placeholder={{ label: 'Chọn Tỉnh/Thành phố', value: null }}
        items={provinces.map(province => ({ label: province.Name, value: province.Id }))}
        onValueChange={handleProvinceChange}
        value={selectedProvince}
      />
      <Text style={styles.label}>Quận/Huyện</Text>
      <RNPickerSelect
        style={pickerSelectStyles}
        placeholder={{ label: 'Chọn Quận/Huyện', value: null }}
        items={districts.map(district => ({ label: district.Name, value: district.Id }))}
        onValueChange={handleDistrictChange}
        value={selectedDistrict}
        disabled={!selectedProvince}
      />
      <Text style={styles.label}>Phường/Xã</Text>
      <RNPickerSelect
        style={pickerSelectStyles}
        placeholder={{ label: 'Chọn Phường/Xã', value: null }}
        items={wards.map(ward => ({ label: ward.Name, value: ward.Id }))}
        onValueChange={handleWardChange}
        value={selectedWard}
        disabled={!selectedDistrict}
      />
      <Text style={styles.label}>Địa chỉ</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập địa chỉ chi tiết"
        value={detailedAddress}
        onChangeText={setDetailedAddress}
      />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Lưu địa chỉ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DetailMyAddressesScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#03a9f4',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#03a9f4',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 16,
    borderColor: '#03a9f4',
    borderWidth: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#03a9f4',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 16,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#03a9f4',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 16,
  },
});
