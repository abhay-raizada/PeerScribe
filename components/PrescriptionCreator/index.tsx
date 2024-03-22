import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {PropsWithChildren, useState} from 'react';
import {Button, Card, Modal} from '@ant-design/react-native';
import { V1Field } from '@formstr/sdk/dist/interfaces';
import { InputFiller } from '../Inputs/Inputs';
import { SendPrescription } from './sendPrescription';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

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

export const PrescriptionCreator = ({form} : {form: any}) => {
  if(form === null) return <View style={{backgroundColor: "#ffffff"}}><Text style={{color: "#000000"}}>Loading...</Text></View>
  const [showSendScreen, setShowSendScreen] = useState(false);

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
          <Button type='primary' onPress={()=>{ setShowSendScreen(true)}}> Create RX </Button>
        </View>
      </Section>
      <SendPrescription isVisible={showSendScreen} onClose={() => { setShowSendScreen(false)}}/>
    </View>
  );
};
