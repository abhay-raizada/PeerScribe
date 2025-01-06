import {Alert, Dimensions, Image, View, Button} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useEffect, useState} from 'react';
import {
  SimplePool,
  UnsignedEvent,
  finalizeEvent,
  getPublicKey,
  nip04,
  nip19,
} from 'nostr-tools';
import EncryptedStorage from 'react-native-encrypted-storage';
import {ImportNsec} from '../common/ImportNsec';
import {Section} from '../common/Section';
import {PatientForm} from './PatientForm';
import {AddressForm} from './AddressForm';
import {MedicineForm} from './MedicineForm';
import {PharmacyPicker, pharmacyData} from '../PharmacyPicker';

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

export const PrescriptionCreator = () => {
  const [showImportNsec, setShowImportNsec] = useState(false);
  const [loggedInNpub, setLoggedInNpub] = useState('');
  const [finalJSON, setFinalJson] = useState({});
  const [selectedPharmacyId, setSelectedPharmacyId] = useState(
    pharmacyData[0].npub,
  );
  const [selectedPharmacyRelays, setSelectedPharmacyRelays] = useState<
    Array<string>
  >([pharmacyData[0].relay!]);

  const handleLocationChange = (item: {
    name: string;
    npub: string;
    relay: string;
  }) => {
    setSelectedPharmacyId(item.npub);
    setSelectedPharmacyRelays([item.relay]);
  };

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

  const nestedFormCallback = (
    xmlTag: string,
    value: Object | Array<any> | string,
  ) => {
    console.log('Filling', xmlTag, value);
    setFinalJson({...finalJSON, [xmlTag]: value});
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
    const pharmacyId = nip19.decode(selectedPharmacyId!).data as string;
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
    console.log(
      'FINAL EVENT IS ',
      finalEvent,
      'relays are',
      selectedPharmacyRelays,
    );
    const pool = new SimplePool();
    console.log('publishing event');
    let messages = await Promise.allSettled(
      pool.publish(selectedPharmacyRelays, finalEvent),
    );
    console.log('Messages from relays', messages);
    Alert.alert('Prescription Sent to the pharmacy!');
  };

  return (
    <View
      style={{
        backgroundColor: Colors.black,
        minHeight: Dimensions.get('window').height,
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
          onPress={() => {
            setShowImportNsec(true);
          }}
          title="edit"
        />
      </Section>

      <PharmacyPicker handleLocationChange={handleLocationChange} />

      <Section title="Create Prescription">
        <View style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
          <Section title="Patient" collapsible={true}>
            {' '}
            <PatientForm nestedFormCallback={nestedFormCallback} />
          </Section>
          <Section title="Address" collapsible={true}>
            <AddressForm nestedFormCallback={nestedFormCallback} />
          </Section>
          <Section title="Medication" collapsible={true}>
            <MedicineForm nestedFormCallback={nestedFormCallback} />
          </Section>
          <View style={{margin: 15}}>
            <Button onPress={handleButtonPress} title="Create Rx" />
          </View>
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
