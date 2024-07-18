// RegisterCarComponent/InputField.js
import React, { forwardRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const InputField = forwardRef(({ label, error, onChangeText, placeholder,autoCorrect, autoCapitalize, returnKeyType, multiline, numberOfLines, labelStyle }, ref) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <View style={[styles.inputContainer, error ? styles.inputError : null, multiline ? styles.multilineContainer : null]}>
        <TextInput
          style={[styles.input, multiline ? styles.descriptionInput : null]}
          onChangeText={onChangeText}
          placeholder={placeholder}
          autoCorrect={autoCorrect}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          ref={ref}
        />
      </View>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#03a9f4',
    borderWidth: 1,
    borderRadius: 7,
    padding: 14,
    width: '100%',
    height: 55,
  },
  multilineContainer: {
    height: 150,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
  },
  descriptionInput: {
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: 'red',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 5,
  },
});

export default InputField;
