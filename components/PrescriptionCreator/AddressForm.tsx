import {Text, TextInput, View} from 'react-native';
import {Section} from './Section';
import {styles, TextTheme} from './styles';
import {useState} from 'react';

interface AddressForm {
  address_line_1?: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
  country_code?: string;
}

interface AddressFormProps {
  nestedFormCallback: (tag: string, form: Object) => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  nestedFormCallback,
}) => {
  const [form, setForm] = useState<AddressForm>({});

  const handleTextChange = (tag: keyof AddressForm, text: string) => {
    let newForm = {...form};
    newForm[tag] = text;
    setForm(newForm);
    nestedFormCallback('Address', newForm);
  };

  return (
    <Section title="Address">
      <View>
        <View>
          <Text style={TextTheme}>Address Line 1</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter street"
            value={form.address_line_1}
            placeholderTextColor="white"
            onChangeText={(text: string) =>
              handleTextChange('address_line_1', text)
            }
          />
        </View>
        <View>
          <Text style={TextTheme}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter city"
            value={form.city}
            placeholderTextColor="white"
            onChangeText={(text: string) => handleTextChange('city', text)}
          />
        </View>
        <View>
          <Text style={TextTheme}>State Provice</Text>
          <TextInput
            style={styles.input}
            placeholder="enter state..."
            value={form.state_province}
            placeholderTextColor="white"
            onChangeText={(text: string) =>
              handleTextChange('state_province', text)
            }
          />
        </View>
        <View>
          <Text style={TextTheme}>Postal Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter postal code..."
            value={form.postal_code}
            placeholderTextColor="white"
            onChangeText={(text: string) =>
              handleTextChange('postal_code', text)
            }
          />
        </View>
        <View>
          <Text style={TextTheme}>Country Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Country Code..."
            value={form.country_code}
            placeholderTextColor="white"
            onChangeText={(text: string) =>
              handleTextChange('country_code', text)
            }
          />
        </View>
      </View>
    </Section>
  );
};
