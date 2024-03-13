import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import SampleJSON from '../../formstr/sample.json';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {PropsWithChildren} from 'react';
import {Card} from '@ant-design/react-native';

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

export const PrescriptionCreator = () => {
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
          uri: SampleJSON.settings.titleImageUrl,
        }}
      />
      <Section title="PeerScribe">
        From the practice of {SampleJSON.name}
      </Section>

      <Section title="Prescription">
        <View style={{display: 'flex', flexDirection: 'column'}}>
          {SampleJSON.fields.map(field => {
            return (
              <Card
                key={field.questionId}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 10,
                  backgroundColor: Colors.white,
                  margin: 10,
                  width: 500,
                  height: 'auto',
                }}>
                <Text
                  style={{
                    color: Colors.green,
                  }}>
                  {field.question}
                </Text>
                <Text
                  style={{
                    color: Colors.light,
                  }}>
                  {field.answerType}
                </Text>
              </Card>
            );
          })}
        </View>
      </Section>
    </View>
  );
};
