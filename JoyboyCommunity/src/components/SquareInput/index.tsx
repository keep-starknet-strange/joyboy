import {useStyles} from '../../hooks';
import {Input, InputProps} from '../Input';
import stylesheet from './styles';

export type SquareInputProps = InputProps;

export const SquareInput: React.FC<SquareInputProps> = (props) => {
  const {
    error,
    left,
    right,
    style: styleProp,
    containerStyle: containerStyleProp,
    inputStyle: inputStyleProp,
    multiline,
    ...inputProps
  } = props;

  const styles = useStyles(stylesheet, !!left, !!right, !!multiline);

  return (
    <Input
      style={[styles.content, styleProp]}
      containerStyle={[styles.container, containerStyleProp]}
      inputStyle={[styles.input, inputStyleProp]}
      error={error}
      left={left}
      right={right}
      multiline={multiline}
      {...inputProps}
    />
  );
};
