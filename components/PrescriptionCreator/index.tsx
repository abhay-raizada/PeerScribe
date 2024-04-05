import {Alert, Appearance, Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {PropsWithChildren, useState} from 'react';
import {Button, Card, Modal} from '@ant-design/react-native';
import { V1Field } from '@formstr/sdk/dist/interfaces';
import { InputFiller } from '../Inputs/Inputs';
// import { SendPrescription } from './sendPrescription';
import { Dropdown } from 'react-native-element-dropdown';
import { SimplePool, UnsignedEvent, finalizeEvent, generateSecretKey, getPublicKey, nip04, nip19 } from 'nostr-tools';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const colorScheme = Appearance.getColorScheme();

const backgroundStyle = {
  backgroundColor: Colors.darker,
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    width: Dimensions.get('window').width - 80,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '500',
  },
});


const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height

function Section({children, title}: SectionProps): React.JSX.Element {
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: Colors.white,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: Colors.light,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}
const locationData = [
  { label: 'Pharmacy A', value: 'A', npub: 'npub1tea09rtjeuzgk4gjajzry37wuyv7h02d4zw38cpadcrkg5yt0qhqncr7km', relays: ["wss://relay.damus.io"]},
  { label: 'Pharmacy B', value: 'B', npub: 'npub1tea09rtjeuzgk4gjajzry37wuyv7h02d4zw38cpadcrkg5yt0qhqncr7km', relays: ["wss://relay.primal.net"]},
  { label: 'Pharmacy C', value: 'C', npub: 'npub1tea09rtjeuzgk4gjajzry37wuyv7h02d4zw38cpadcrkg5yt0qhqncr7km', relays: ["wss://relay.hllo.live"]},
  { label: 'Pharmacy D', value: 'D', npub: 'npub1tea09rtjeuzgk4gjajzry37wuyv7h02d4zw38cpadcrkg5yt0qhqncr7km', relays: ["wss://nos.lol", "wss://relay.damus.io"]}
]

const locationDummyData = [
  { label: 'Pharmacy A', value: 'A' }
]

export const PrescriptionCreator = ({form} : {form: any}) => {
  if(form === null) return <View style={{backgroundColor: "#ffffff"}}><Text style={{color: "#000000"}}>Loading...</Text></View>
  const [showSendScreen, setShowSendScreen] = useState(false);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState("");
  const [selectedPharmacyRelays, setSelectedPharmacyRelays] = useState([]);

  const renderItem = (item: any) => {
    return <View style={{width: width, display: 'flex', flexDirection: 'column', padding: 10, flexWrap: "wrap"}}>
      <Text style={{color: "black", fontSize: 24}}>{item.label}</Text>
      <View style={{width: width -100}}>
        <Text style={{color: 'grey', paddingBottom: 5}}>Npub: {item.npub}</Text>
        <Text style={{color: 'grey'}}>Relays: {item.relays.join(', ')}</Text>
      </View>
      </View>
  }

  const handleLocationChange = (item: any) => {
    setSelectedPharmacyId(item.npub)
    setSelectedPharmacyRelays(item.relays)
  }

  const sendPrescription = async () => {
    console.log("Will generate IDs")
    const sk = generateSecretKey()
    const pk = getPublicKey(sk)
    const pharmacyId = nip19.decode(selectedPharmacyId).data as string
    console.log("Ids generated", sk, pk)
    const baseKind4Event: UnsignedEvent = {
      kind: 4,
      tags: [["p", pharmacyId ]],
      content: await nip04.encrypt(sk, pharmacyId, "This is a test message from PeerScribe" ),
      created_at: Math.floor(Date.now() / 1000),
      pubkey: pk
    }
    const finalEvent = finalizeEvent(baseKind4Event, sk)
    const pool = new SimplePool()
    console.log("publishing event")
    await Promise.any(pool.publish(selectedPharmacyRelays, finalEvent))
    console.log("Event Published")
    Alert.alert("Prescription Sent to the pharmacy!")
  } 

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
          uri: form.settings.titleImageUrl,
        }}
      />
      <Section title="PeerScribe">
        From the practice of {form.name}
      </Section>

      <Section title="Choose a Pharmacy">
        <View style={{ width: width -40}}>
          <Dropdown data={locationData} labelField={'label'} valueField={'label'} onChange={handleLocationChange} 
            renderItem={renderItem} style={{width: "100%"}} placeholderStyle={{color: "white"}} selectedTextStyle={{color: 'white'}}/>
          </View>
      </Section>

      <Section title="Prescription">
        <View style={{display: 'flex', flexDirection: 'column', width: "100%"}}>
          {form.fields.map((field: V1Field) => {
            return (
              <Card
                key={field.questionId}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 10,
                  backgroundColor: Colors.white,
                  margin: 10,
                  width: 350,
                  height: 'auto',
                }}>
                <Text
                  style={{
                    color: "#000000",
                  }}>
                  {field.question}
                </Text>
                {/* <Text
                  style={{
                    color: Colors.light,
                  }}>
                  {field.answerType}
                </Text> */}
                <InputFiller answerSettings={field.answerSettings} answerType={field.answerType} onChange={() => {}} />
              </Card>
            );
          })}
          <Button type='primary' onPress={sendPrescription}> Create RX </Button>
        </View>
      </Section>
      {/* <SendPrescription isVisible={showSendScreen} onClose={() => { setShowSendScreen(false)}}/> */}

    </View>
  );
};
