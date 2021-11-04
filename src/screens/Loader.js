import React, {useEffect} from 'react';
import {StyleSheet, ActivityIndicator, View, Text, Image} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Loader() {
  // useEffect(async () => {
  //   await AsyncStorage.clear();
  // });
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo.png')}
        style={{height: 33, width: 25}}
      />
      <Text style={styles.logo}>ChatBae</Text>
      <ActivityIndicator size="large" color="#fdfdfd" style={styles.loader} />
      <Text style={styles.loadingText}>Loading....</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212020',
  },
  logo: {
    color: '#fdfdfd',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    marginVertical: 5,
  },
  loader: {
    marginBottom: 5,
  },
  loadingText: {
    color: '#999999',
    fontSize: 15,
    marginVertical: 5,
  },
});
