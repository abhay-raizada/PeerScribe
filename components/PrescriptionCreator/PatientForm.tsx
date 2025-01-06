import {Text, TextInput, View, Button} from 'react-native';
import {Section} from '../common/Section';
import {styles, TextTheme} from '../common/styles';
import {useState} from 'react';
import DatePicker from 'react-native-date-picker';

interface PatientForm {
  name?: string;
  date_of_birth?: string;
}

interface PatientFormProps {
  nestedFormCallback: (tag: string, form: Object) => void;
  initForm: {[key: string]: any};
}

const PATIENT_KEY = 'patient';

export const PatientForm: React.FC<PatientFormProps> = ({
  nestedFormCallback,
  initForm,
}) => {
  const [form, setForm] = useState<PatientForm>(
    initForm[PATIENT_KEY]?.['human_patient'] || {},
  );
  const [openDate, setOpenDate] = useState<boolean>(false);

  const handleTextChange = (tag: 'name' | 'date_of_birth', text: string) => {
    let newForm = {...form};
    newForm[tag] = text;
    setForm(newForm);
    nestedFormCallback(PATIENT_KEY, {human_patient: newForm});
  };

  return (
    <View>
      <View>
        <Text style={TextTheme}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Patients Name"
          value={form.name}
          placeholderTextColor="white"
          onChangeText={(text: string) => handleTextChange('name', text)}
        />
      </View>
      <View>
        <Text style={TextTheme}>Date of Birth</Text>
        {form.date_of_birth ? (
          <View>
            <Text style={TextTheme}>{form.date_of_birth}</Text>
            <Button
              onPress={() => {
                setOpenDate(true);
              }}
              title="Edit"
            />
          </View>
        ) : (
          <Button
            onPress={() => {
              setOpenDate(true);
            }}
            title="Pick a date"
          />
        )}
        <DatePicker
          modal
          mode={'date'}
          open={openDate}
          date={new Date(form.date_of_birth || '1990-01-01')}
          onCancel={() => setOpenDate(false)}
          onConfirm={(date: Date) => {
            handleTextChange('date_of_birth', date.toDateString());
            setOpenDate(false);
          }}
        />
      </View>
    </View>
  );
};
