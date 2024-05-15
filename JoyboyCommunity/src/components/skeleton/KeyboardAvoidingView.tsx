import React from "react";
import { SafeAreaView } from "react-native";
import {
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  Platform,
} from "react-native";

interface Props {
  children: React.ReactNode;
}

const KeyboardAvoidingView = (props: Props) => {
  return Platform.OS === "ios" ? (
    <RNKeyboardAvoidingView behavior="padding" style={{ flex: 1 }} {...props}>
      <TouchableWithoutFeedback
        style={{ flexGrow: 1 }}
        onPress={Keyboard.dismiss}
      >
        <SafeAreaView style={{ flex: 1 }}>{props.children}</SafeAreaView>
      </TouchableWithoutFeedback>
    </RNKeyboardAvoidingView>
  ) : (
    <>{props.children}</>
  );
};

export default KeyboardAvoidingView;
