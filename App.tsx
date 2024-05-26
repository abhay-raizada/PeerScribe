/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StatusBar, StyleSheet} from 'react-native';

import {getFormTemplate} from './formstr/formstr';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {PrescriptionCreator} from './components/PrescriptionCreator';
import 'react-native-url-polyfill/auto';
import PolyfillCrypto from 'react-native-webview-crypto';

function App(): React.JSX.Element {
  const backgroundStyle = {
    backgroundColor: Colors.darker,
  };

  const [form, setForm] = useState<{} | null>(null);

  useEffect(() => {
    console.log('inside useeffect');
    const fetchForm = async () => {
      if (!form) {
        let form = await getFormTemplate(
          'eb3df1f89653475f0bcbd22da35f8d2f126db8a68a88a7abedc53535c76c39b4',
        );
      }
    };
    fetchForm();
  }, [form, setForm]);

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
