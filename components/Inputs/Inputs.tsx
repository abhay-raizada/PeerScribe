import { DatePicker, DatePickerView, InputItem, List, Text, TextareaItem, View } from "@ant-design/react-native";
import { V1AnswerSettings, AnswerTypes } from "@formstr/sdk/dist/interfaces";
import { useState } from "react";
import RNPickerSelect from "react-native-picker-select"

interface InputFillerProps {
  answerType: AnswerTypes;
  answerSettings: V1AnswerSettings;
  onChange: (answer: string, message?: string) => void;
  defaultValue?: string | number | boolean;
}

export const InputFiller: React.FC<InputFillerProps> = ({
  answerType,
  answerSettings,
  onChange,
  defaultValue,
}) => {

  const [inputValue, setInputValue] = useState("");
  const handleInputChange = (
    e: any
  ) => {
    setInputValue(e.target.value)
  };

  const handleValueChange = (value: string | null) => {
    if (!value) return;
    onChange(value);
  };

  const getInput = (
    answerType: AnswerTypes,
    answerSettings: V1AnswerSettings
  ) => {
    const dropdownItems = (answerSettings.choices || []).map((choice) => {
      return {
          label: choice.label, value: choice.choiceId, key: choice.choiceId
  }})
    const INPUT_TYPE_COMPONENT_MAP: { [key in AnswerTypes]?: JSX.Element } = {
      [AnswerTypes.label]: <></>,
      [AnswerTypes.shortText]: (
        <InputItem
        onChange={handleInputChange}
        defaultValue={defaultValue as string}
        placeholder="enter a value...">
      </InputItem>
      ),
      [AnswerTypes.paragraph]: (
        <TextareaItem
        rows={10}
        placeholder="enter a value.."
        onChange={handleInputChange}
        autoHeight
        style={{ paddingVertical: 5 }}
      />
      ),
      [AnswerTypes.number]: (
        // <InputNumber
        //   defaultValue={defaultValue as string}
        //   onChange={handleValueChange}
        //   style={{ width: "100%" }}
        //   placeholder="Please enter your response"
        // />
        <View></View>
      ),
      [AnswerTypes.radioButton]: (
        // <ChoiceFiller
        //   answerType={answerType as AnswerTypes.radioButton}
        //   answerSettings={answerSettings}
        //   defaultValue={defaultValue as string}
        //   onChange={handleValueChange}
        // />
        <View></View>
      ),
      [AnswerTypes.checkboxes]: (
        // <ChoiceFiller
        //   defaultValue={defaultValue as string}
        //   answerType={answerType as AnswerTypes.checkboxes}
        //   answerSettings={answerSettings}
        //   onChange={handleValueChange}
        // />
        <View></View>
      ),
      [AnswerTypes.dropdown]: (
            <RNPickerSelect 
                onValueChange={(value) => { setInputValue(value), console.log("selected value is: ", value)}} 
                items={dropdownItems}
                placeholder={{}}
                key="picker" 
                value={inputValue}
            ><Text>{inputValue ? answerSettings.choices?.filter((choice) => { return choice.choiceId === inputValue})[0].label : "Select an option"}</Text></RNPickerSelect>
      ),
      [AnswerTypes.date]: (
        <List>
            <DatePicker key="Datepicker" />
        </List>
      ),
      [AnswerTypes.time]: (
        <List>
            <DatePicker key="time" />
        </List>
      ),
    };

    return INPUT_TYPE_COMPONENT_MAP[answerType];
  };

  return <>{getInput(answerType, answerSettings)}</>;
};
