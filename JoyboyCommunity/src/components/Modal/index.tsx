import {View, ViewProps} from 'react-native';
import {Portal} from 'react-native-portalize';

import {useStyles} from '../../hooks';
import stylesheet from './styles';

export type ModalProps = ViewProps & {
  containerProps?: ViewProps;
};

export const Modal: React.FC<ModalProps> = ({
  containerProps,
  style: styleProp,
  children,
  ...modalProps
}) => {
  const styles = useStyles(stylesheet);

  return (
    <Portal>
      <View style={[styles.container, containerProps?.style]} {...containerProps}>
        <View style={[styles.modal, styleProp]} {...modalProps}>
          {children}
        </View>
      </View>
    </Portal>
  );
};
