import {useRef} from 'react';
import {Platform, Pressable, StyleProp, View, ViewStyle} from 'react-native';
import {Portal} from 'react-native-portalize';

import {Modalize} from '../Modalize';
import {Text, TextProps} from '../Text';

export type PickerContainerProps = {
  selectedValue: string;
  modalizeTitle: string;

  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  textProps?: TextProps;

  children?: React.ReactNode;
};

export const PickerContainer: React.FC<PickerContainerProps> = (props) => {
  const {selectedValue, modalizeTitle, style, containerStyle, textProps, children} = props;

  const modalizeRef = useRef<Modalize>(null);

  const onTouchablePress = () => {
    modalizeRef.current?.open();
  };

  return (
    <View style={containerStyle}>
      {Platform.OS === 'ios' ? (
        <>
          <Pressable style={style} onPress={onTouchablePress}>
            <Text {...textProps}>{selectedValue}</Text>
          </Pressable>

          <Portal>
            <Modalize ref={modalizeRef} title={modalizeTitle}>
              {children}
            </Modalize>
          </Portal>
        </>
      ) : (
        children
      )}
    </View>
  );
};
