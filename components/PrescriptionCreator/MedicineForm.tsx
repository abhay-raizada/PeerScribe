import {Text, TextInput, View} from 'react-native';
import {Section} from '../common/Section';
import {styles, TextTheme} from '../common/styles';
import {useState} from 'react';

interface MedicineForm {
  name?: string;
  dosage_form?: string;
  strength?: string;
  quantity?: string;
  refills?: string;
  directions?: string;
}

interface MedicineFormProps {
  nestedFormCallback: (tag: string, form: Object) => void;
}

export const MedicineForm: React.FC<MedicineFormProps> = ({
  nestedFormCallback,
}) => {
  const [form, setForm] = useState<MedicineForm>({});

  const handleTextChange = (tag: keyof MedicineForm, text: string) => {
    let newForm = {...form};
    newForm[tag] = text;
    setForm(newForm);
    nestedFormCallback('MedicationPrescribed', newForm);
  };

  return (
    <Section title="Medicine">
      <View>
        <View>
          <Text style={TextTheme}>Name of Medicine</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter name of medicine"
            value={form.name}
            placeholderTextColor="white"
            onChangeText={(text: string) => handleTextChange('name', text)}
          />
        </View>
        <View>
          <Text style={TextTheme}> Form of Dosage</Text>
          <TextInput
            style={styles.input}
            placeholder="what is the dosage form"
            value={form.dosage_form}
            placeholderTextColor="white"
            onChangeText={(text: string) =>
              handleTextChange('dosage_form', text)
            }
          />
        </View>
        <View>
          <Text style={TextTheme}>Strength</Text>
          <TextInput
            style={styles.input}
            placeholder="enter strength..."
            value={form.strength}
            placeholderTextColor="white"
            onChangeText={(text: string) => handleTextChange('strength', text)}
          />
        </View>
        <View>
          <Text style={TextTheme}>Quantity</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter quantity..."
            value={form.quantity}
            placeholderTextColor="white"
            onChangeText={(text: string) => handleTextChange('quantity', text)}
          />
        </View>
        <View>
          <Text style={TextTheme}>Refills</Text>
          <TextInput
            style={styles.input}
            placeholder="Refills"
            value={form.refills}
            placeholderTextColor="white"
            onChangeText={(text: string) => handleTextChange('refills', text)}
          />
        </View>
        <View>
          <Text style={TextTheme}>Directions</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter directions"
            value={form.refills}
            placeholderTextColor="white"
            onChangeText={(text: string) =>
              handleTextChange('directions', text)
            }
          />
        </View>
      </View>
    </Section>
  );
};
