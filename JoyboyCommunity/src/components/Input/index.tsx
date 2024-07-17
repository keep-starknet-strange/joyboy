import {StyleProp, TextInput, TextInputProps, TextStyle, View, ViewStyle} from 'react-native';

import {useStyles, useTheme} from '../../hooks';
import {Text} from '../Text';
import stylesheet from './styles';

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
    error,
    left,
    right,
    style: styleProp,
    containerStyle: containerStyleProp,
    inputStyle: inputStyleProp,
    ...inputProps
  } = props;

  const {theme} = useTheme();
  const styles = useStyles(stylesheet, !!error, !!left, !!right);

  return (
    <View style={[styles.container, containerStyleProp]}>
      <View style={[styles.content, styleProp]}>
        {left}

        <TextInput
          style={[styles.input, inputStyleProp]}
          placeholderTextColor={theme.colors.inputPlaceholder}
          underlineColorAndroid="transparent"
          {...inputProps}
        />

        {right}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};
