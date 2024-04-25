import { DatePicker, DatePickerView, InputItem, List, Text, TextareaItem, View } from "@ant-design/react-native";
import { V1AnswerSettings, AnswerTypes } from "@formstr/sdk/dist/interfaces";
import { useState } from "react";
import RNPickerSelect from "react-native-picker-select"

interface InputFillerProps {
  answerType: AnswerTypes;
  answerSettings: V1AnswerSettings;
  onChange: (answer: string) => void;
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
    console.log("E is", e)
    setInputValue(e);
    onChange(e)
  };

  const handleValueChange = (value: string) => {
    if (!value) return;
    setInputValue(value)
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
          onChange={handleValueChange}
          defaultValue={defaultValue as string}
          placeholder="enter a value..."
          placeholderTextColor="#aaaaaa">
        </InputItem>
      ),
      [AnswerTypes.paragraph]: (
        <TextareaItem
          rows={10}
          placeholder="enter a value.."
          placeholderTextColor="#aaaaaa"
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
                onValueChange={handleValueChange} 
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
