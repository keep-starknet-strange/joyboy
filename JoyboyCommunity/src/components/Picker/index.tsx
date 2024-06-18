import {Picker as RNPicker, PickerProps as RNPickerProps} from '@react-native-picker/picker';
import {forwardRef} from 'react';

import {useStyles} from '../../hooks';
import {PickerContainer} from '../PickerContainer';
import stylesheet from './styles';

export type PickerProps = RNPickerProps<string> & {
  label: string;
};

export const _Picker = forwardRef<RNPicker<string>, PickerProps>((props, ref) => {
  const {label, selectedValue, children, ...restProps} = props;

  const styles = useStyles(stylesheet);

  return (
    <PickerContainer
      selectedValue={selectedValue}
      modalizeTitle={label}
      containerStyle={styles.container}
      textProps={{fontSize: 15, weight: 'semiBold', color: 'inputText'}}
    >
      <RNPicker ref={ref} selectedValue={selectedValue} {...restProps}>
        {children}
      </RNPicker>
    </PickerContainer>
  );
});
_Picker.displayName = 'Picker';

const Picker = _Picker as typeof _Picker & {Item: typeof RNPicker.Item};
Picker.Item = RNPicker.Item;

export {Picker};
