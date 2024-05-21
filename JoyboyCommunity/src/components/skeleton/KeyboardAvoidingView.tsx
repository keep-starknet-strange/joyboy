import React from "react";
import {
  Keyboard,
  SafeAreaView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  Platform,
} from "react-native";

interface Props {
  children: React.ReactNode;
}

export const KeyboardAvoidingView = (props: Props) => {
  if (Platform.OS !== "ios") {
    return props.children;
  }

  return (
    <RNKeyboardAvoidingView behavior="padding" style={{ flex: 1 }} {...props}>
      <TouchableWithoutFeedback
        style={{ flexGrow: 1 }}
        onPress={Keyboard.dismiss}
      >
        <SafeAreaView style={{ flex: 1 }}>{props.children}</SafeAreaView>
      </TouchableWithoutFeedback>
    </RNKeyboardAvoidingView>
  );
};
