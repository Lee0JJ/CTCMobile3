import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, Image, View, Text, Dimensions } from 'react-native';

import { loader } from '../assets/index';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const Loader = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' }}>
      <Image source={loader} style={{ width: WIDTH, height: HEIGHT, resizeMode: 'contain' }} />
      <Text style={{ marginTop: 20, fontFamily: 'Epilogue-Bold', fontSize: 20, color: 'white', textAlign: 'center' }}>Transaction is in progress{"\n"}Please wait...</Text>
    </View>
  );
};

export default Loader;
