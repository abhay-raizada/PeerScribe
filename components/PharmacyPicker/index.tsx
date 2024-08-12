import {Dropdown} from 'react-native-element-dropdown';
import {Section} from '../common/Section';
import {Button, Dimensions, Text, View} from 'react-native';
import React, {useState} from 'react';
import {AddPharmacy} from './AddPharmacy';

export const pharmacyData = [
  {
    label: 'Pharmacy A',
    value: 'A',
    npub: 'npub1tea09rtjeuzgk4gjajzry37wuyv7h02d4zw38cpadcrkg5yt0qhqncr7km',
    relays: ['wss://relay.damus.io'],
  },
  {
    label: ' + Add Pharmacy',
    value: 'custom',
  },
];

let width = Dimensions.get('window').width;

interface PharmacyPickerProps {
  handleLocationChange: (item: any) => void;
}

export const PharmacyPicker: React.FC<PharmacyPickerProps> = ({
  handleLocationChange,
}) => {
  const [showAddPharmacyModal, setShowAddPharmacyModal] = useState(false);

  const renderItem = (item: any) => {
    if (item.value === 'custom') {
      return (
        <View>
          <Button
            title="Add Pharmacy"
            onPress={() => {
              setShowAddPharmacyModal(true);
            }}
          />
        </View>
      );
    }

    return (
      <View
        style={{
          width: width,
          display: 'flex',
          flexDirection: 'column',
          padding: 10,
          flexWrap: 'wrap',
        }}>
        <Text style={{color: 'black', fontSize: 24}}>{item.label}</Text>
        <View style={{width: width - 100}}>
          <Text style={{color: 'grey', paddingBottom: 5}}>
            Npub: {item.npub}
          </Text>
          <Text style={{color: 'grey'}}>Relays: {item.relays.join(', ')}</Text>
        </View>
      </View>
    );
  };

  return (
    <View>
      <Section title="Choose a Pharmacy">
        <View style={{width: width - 40}}>
          <Dropdown
            data={pharmacyData}
            labelField={'label'}
            valueField={'label'}
            onChange={handleLocationChange}
            value={pharmacyData[0]}
            renderItem={renderItem}
            style={{width: '100%'}}
            placeholderStyle={{color: 'white'}}
            selectedTextStyle={{color: 'white'}}
          />
        </View>
      </Section>
      <AddPharmacy
        isVisible={showAddPharmacyModal}
        onClose={() => {
          setShowAddPharmacyModal(false);
        }}
        onAdd={() => {
          setShowAddPharmacyModal(false);
        }}
      />
    </View>
  );
};
