import {useState} from 'react';
import {Alert, Button, Modal, Text, TextInput, View} from 'react-native';
import {Section} from '../common/Section';
import {getData, storeData} from '../../utils/localStorage';

export const AddPharmacy = ({
  isVisible,
  onClose,
  onAdd,
}: {
  isVisible: boolean;
  onClose: () => void;
  onAdd: (npub: string, relay: string, name: string) => void;
}) => {
  const [npub, setNpub] = useState('');
  const [relay, setRelay] = useState('');
  const [name, setName] = useState('');

  const handleNpub = (value: string) => {
    setNpub(value);
  };
  const handleRelay = (value: string) => {
    setRelay(value);
  };
  const handleName = (value: string) => {
    setName(value);
  };

  async function handleAddClick() {
    if (!npub || !relay || !name) {
      Alert.alert(
        'Missing Inputs',
        'Please enter name, npub and relay of the Pharmacy',
      );
      return;
    }
    if (npub.length !== 63 || !npub.startsWith('npub1')) {
      Alert.alert('Invalid Npub');
      return;
    }
    let pharmacyListString = (await getData('pharmacyList')) || '[]';
    let pharmacyList = JSON.parse(pharmacyListString) as Array<{
      label: string;
      npub: string;
      relay: string;
    }>;
    pharmacyList = [...pharmacyList, {label: name, relay: relay, npub: npub}];
    await storeData('pharmacyList', JSON.stringify(pharmacyList));

    onAdd(npub, relay, name);
  }

  return (
    <Modal
      visible={isVisible}
      onRequestClose={() => {
        console.log('closing....');
        onClose();
        return true;
      }}
      onDismiss={() => {
        onClose();
      }}
      transparent={true}
      style={{backgroundColor: 'black', margin: 0, padding: 0, height: '80%'}}
      animationType="slide">
      <View
        style={{
          backgroundColor: 'black',
          justifyContent: 'center',
          minHeight: '80%',
          display: 'flex',
          margin: 30,
          alignItems: 'center',
        }}>
        <Section title="Add A Pharmacy">
          <View style={{margin: 5}}>
            <Text style={{color: 'white', margin: 5}}>Add Pharmacy Name</Text>
            <TextInput
              style={{
                borderColor: '#000000',
                borderWidth: 1,
                borderRadius: 5,
                color: 'white',
              }}
              placeholderTextColor="grey"
              placeholder="Pharmacy X"
              onChangeText={handleName}
            />

            <Text style={{color: 'white', margin: 5}}>Add Pharmacy Npub</Text>
            <TextInput
              style={{
                borderColor: '#000000',
                borderWidth: 1,
                borderRadius: 5,
                color: 'white',
              }}
              placeholderTextColor="grey"
              placeholder="npub1...."
              onChangeText={handleNpub}
            />

            <Text style={{color: 'white', margin: 5}}>Add Pharmacy Relay</Text>
            <TextInput
              style={{
                borderColor: '#000000',
                borderWidth: 1,
                borderRadius: 5,
                color: 'white',
              }}
              placeholderTextColor="grey"
              placeholder="wss://<relay-url>"
              onChangeText={handleRelay}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{margin: 10}}>
              <Button title="Cancel" onPress={() => onClose()}></Button>
            </View>
            <View style={{margin: 10}}>
              <Button title="Add" onPress={handleAddClick}></Button>
            </View>
          </View>
        </Section>
      </View>
    </Modal>
  );
};
