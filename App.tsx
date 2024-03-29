/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet } from 'react-native';

import { getFormTemplate } from './formstr/formstr';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { PrescriptionCreator } from './components/PrescriptionCreator';
import 'react-native-url-polyfill/auto';

function App(): React.JSX.Element {
  const backgroundStyle = {
    backgroundColor: Colors.darker,
  };

  const [form, setForm] = useState<{} | null>(null);

  useEffect(() => {
    console.log('inside useeffect');
    const fetchForm = async () => {
      if (!form) {
        console.log('fetchiiiing forrmmm!!!');
        let form = await getFormTemplate(
          'eb3df1f89653475f0bcbd22da35f8d2f126db8a68a88a7abedc53535c76c39b4',
        )
        setForm(form);
      }
    };
    fetchForm();
  }, [form]);

  return (
    <SafeAreaView style={backgroundStyle}>
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
