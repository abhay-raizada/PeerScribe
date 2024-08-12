/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {PrescriptionCreator} from './components/PrescriptionCreator';
import 'react-native-url-polyfill/auto';
import PolyfillCrypto from 'react-native-webview-crypto';

function App(): React.JSX.Element {
  const backgroundStyle = {
    backgroundColor: 'black',
    color: 'white',
  };

  const [form, setForm] = useState<{} | null>(null);

  useEffect(() => {
    console.log('inside useeffect');
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <PolyfillCrypto />
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <PrescriptionCreator />
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
