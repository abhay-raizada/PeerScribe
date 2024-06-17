import {Alert, Appearance, Dimensions, Image, Text, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {PropsWithChildren, useEffect, useState} from 'react';
import {Button, Card, Modal} from '@ant-design/react-native';
// import { SendPrescription } from './sendPrescription';
import {Dropdown} from 'react-native-element-dropdown';
import {
  SimplePool,
  UnsignedEvent,
  finalizeEvent,
  generateSecretKey,
  getPublicKey,
  nip04,
  nip19,
} from 'nostr-tools';
import EncryptedStorage from 'react-native-encrypted-storage';
import {ImportNsec} from './ImportNsec';
import {json2xml} from 'xml-js';
import {Section} from './Section';
import {PatientForm} from './PatientForm';
import {AddressForm} from './AddressForm';

/*
          Patient 
          - Name
          - Date Of Birth

          Address 
          - Address Line 1
          - City 
          - StateProvince
          - Postal Code
          - Country Code

          Medicine 
          - Name
          - Dosage Form
          - Strength
          - Quantity
          - Re-fills
          - Directions
          `
          */

function OBJtoXML(obj: any) {
  var xml = '';
  for (var prop in obj) {
    xml += '<' + prop + '>';
    if (Array.isArray(obj[prop])) {
      for (var array of obj[prop]) {
        // A real botch fix here
        xml += '</' + prop + '>';
        xml += '<' + prop + '>';

        xml += OBJtoXML(new Object(array));
      }
    } else if (typeof obj[prop] == 'object') {
      xml += OBJtoXML(new Object(obj[prop]));
    } else {
      xml += obj[prop];
    }
    xml += '</' + prop + '>';
  }
  var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
  return xml;
}

const colorScheme = Appearance.getColorScheme();

const backgroundStyle = {
  backgroundColor: Colors.darker,
};

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height;

const locationData = [
  {
    label: 'Pharmacy A',
    value: 'A',
    npub: 'npub1tea09rtjeuzgk4gjajzry37wuyv7h02d4zw38cpadcrkg5yt0qhqncr7km',
    relays: ['wss://relay.damus.io'],
  },
  {
    label: 'Pharmacy B',
    value: 'B',
    npub: 'npub1tea09rtjeuzgk4gjajzry37wuyv7h02d4zw38cpadcrkg5yt0qhqncr7km',
    relays: ['wss://relay.primal.net'],
  },
  {
    label: 'Pharmacy C',
    value: 'C',
    npub: 'npub1tea09rtjeuzgk4gjajzry37wuyv7h02d4zw38cpadcrkg5yt0qhqncr7km',
    relays: ['wss://relay.hllo.live'],
  },
  {
    label: 'Pharmacy D',
    value: 'D',
    npub: 'npub1tea09rtjeuzgk4gjajzry37wuyv7h02d4zw38cpadcrkg5yt0qhqncr7km',
    relays: ['wss://nos.lol', 'wss://relay.damus.io'],
  },
];

const locationDummyData = [{label: 'Pharmacy A', value: 'A'}];

export const PrescriptionCreator = () => {
  const [showImportNsec, setShowImportNsec] = useState(false);
  const [loggedInNpub, setLoggedInNpub] = useState('');
  const [selectedPharmacyId, setSelectedPharmacyId] = useState(
    locationData[0].npub,
  );
  const [selectedPharmacyRelays, setSelectedPharmacyRelays] = useState([]);
  const [finalJSON, setFinalJson] = useState({});

  useEffect(() => {
    async function initialize() {
      let doctorCredentials = null;
      try {
        doctorCredentials = await EncryptedStorage.getItem('user_credentials');
        if (!doctorCredentials) {
          setShowImportNsec(true);
        } else {
          setLoggedInNpub(
            nip19.npubEncode(
              getPublicKey(nip19.decode(doctorCredentials).data as Uint8Array),
            ),
          );
        }
      } catch (e) {
        console.log('Error getting credentials', e);
      }
    }
    initialize();
  }, []);
  const renderItem = (item: any) => {
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

  const nestedFormCallback = (
    xmlTag: string,
    value: Object | Array<any> | string,
  ) => {
    console.log('Filling', xmlTag, value);
    setFinalJson({...finalJSON, [xmlTag]: value});
  };

  const handleLocationChange = (item: any) => {
    setSelectedPharmacyId(item.npub);
    setSelectedPharmacyRelays(item.relays);
  };

  const handleImportNsec = (nsec: string) => {
    EncryptedStorage.setItem('user_credentials', nsec);
    if (nsec.startsWith('nsec1') && nsec.length !== 63) {
      Alert.alert('not a valid nsec!');
      return;
    }
    setLoggedInNpub(
      nip19.npubEncode(getPublicKey(nip19.decode(nsec).data as Uint8Array)),
    );
    setShowImportNsec(false);
  };

  const handleButtonPress = () => {
    console.log('Final JSON is', finalJSON);
    const xml = OBJtoXML({prescription: finalJSON});
    console.log('XML is...', xml, typeof xml);
    sendPrescription(xml);
  };

  const sendPrescription = async (xml: string) => {
    console.log('Will generate IDs');
    const sk = nip19.decode(
      (await EncryptedStorage.getItem('user_credentials')) as `nsec1${string}`,
    ).data as Uint8Array;
    const pk = getPublicKey(sk);
    const pharmacyId = nip19.decode(selectedPharmacyId).data as string;
    console.log('Got ids');
    console.log('content is ', xml);
    const baseKind4Event: UnsignedEvent = {
      kind: 4,
      tags: [['p', pharmacyId]],
      content: await nip04.encrypt(sk, pharmacyId, `${xml}`),
      created_at: Math.floor(Date.now() / 1000),
      pubkey: pk,
    };
    const finalEvent = finalizeEvent(baseKind4Event, sk);
    const pool = new SimplePool();
    console.log('publishing event');
    await Promise.allSettled(pool.publish(selectedPharmacyRelays, finalEvent));
    console.log('Event Published');
    Alert.alert('Prescription Sent to the pharmacy!');
  };

  return (
    <View
      style={{
        backgroundColor: Colors.black,
      }}>
      <Image
        style={{
          height: 100,
          width: Dimensions.get('window').width,
        }}
        source={{
          uri: 'https://www.studentdoctor.net/wp-content/uploads/2018/08/20180815_prescription.png',
        }}
      />
      <Section title="PeerScribe">
        From the practice of {loggedInNpub}
        <Button
          size="small"
          onPress={() => {
            setShowImportNsec(true);
          }}>
          Edit!
        </Button>
      </Section>

      <Section title="Choose a Pharmacy">
        <View style={{width: width - 40}}>
          <Dropdown
            data={locationData}
            labelField={'label'}
            valueField={'label'}
            onChange={handleLocationChange}
            value={locationData[0]}
            renderItem={renderItem}
            style={{width: '100%'}}
            placeholderStyle={{color: 'white'}}
            selectedTextStyle={{color: 'white'}}
          />
        </View>
      </Section>

      <Section title="Prescription">
        <View style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
          <PatientForm nestedFormCallback={nestedFormCallback} />
          <AddressForm nestedFormCallback={nestedFormCallback} />
          <Button type="primary" onPress={handleButtonPress}>
            <Text
              style={[
                {
                  color: Colors.light,
                },
              ]}>
              {' '}
              Create RX{' '}
            </Text>
          </Button>
        </View>
      </Section>
      <ImportNsec
        isVisible={showImportNsec}
        onClose={() => {
          setShowImportNsec(false);
        }}
        onPress={handleImportNsec}
      />
    </View>
  );
};
