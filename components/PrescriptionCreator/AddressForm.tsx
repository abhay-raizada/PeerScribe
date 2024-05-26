import {Text, TextInput, View} from 'react-native';
import {Section} from './Section';
import {styles, TextTheme} from './styles';
import {useState} from 'react';
import DatePicker from 'react-native-date-picker';
import {Button} from '@ant-design/react-native';

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
  const [openDate, setOpenDate] = useState<boolean>(false);

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
          <Text style={TextTheme}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Address Line 1"
            value={form.address_line_1}
            placeholderTextColor="white"
            onChangeText={(text: string) =>
              handleTextChange('address_line_1', text)
            }
          />
        </View>
      </View>
    </Section>
  );
};
