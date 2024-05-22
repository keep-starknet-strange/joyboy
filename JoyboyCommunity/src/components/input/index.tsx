import {StyleProp, TextInput, TextInputProps, TextStyle, View, ViewStyle} from 'react-native';

import {Typography} from '../typography';
import styles from './styles';

export type InputProps = TextInputProps & {
  /**
   * Error message to be displayed.
   * If this prop is not provided or is undefined, no error message will be displayed.
   */
  error?: string;

  left?: React.ReactNode;
  right?: React.ReactNode;

  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export const Input: React.FC<InputProps> = (props) => {
  const {
    value,
    placeholder,
    error,
    left,
    right,
    style: styleProp,
    containerStyle: containerStyleProp,
    inputStyle: inputStyleProp,
    ...inputProps
  } = props;

  return (
    <View style={[styles.container, containerStyleProp]}>
      <View style={[styles.content, styleProp]}>
        {left}

        <TextInput
          value={value}
          placeholder={placeholder}
          style={[
            styles.input,
            left && styles.inputWithLeft,
            right && styles.inputWithRight,
            inputStyleProp,
          ]}
          placeholderTextColor="#A1A1C7"
          underlineColorAndroid="transparent"
          {...inputProps}
        />

        {right}
      </View>

      {error ? <Typography style={styles.errorText}>{error}</Typography> : null}
    </View>
  );
};
