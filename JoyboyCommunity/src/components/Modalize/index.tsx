import {forwardRef} from 'react';
import {Platform, StyleProp, View, ViewStyle} from 'react-native';
import {Modalize as RNModalize, ModalizeProps as RNModalizeProps} from 'react-native-modalize';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useStyles} from '../../hooks';
import {Divider} from '../Divider';
import {Text} from '../Text';
import stylesheet from './styles';

export type Modalize = RNModalize;

export type ModalizeProps = RNModalizeProps & {
  title?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

export const Modalize = forwardRef<RNModalize, ModalizeProps>((props, ref) => {
  const {title, style: styleProp, modalStyle: modalStyleProp, children, ...modalizeProps} = props;

  const styles = useStyles(stylesheet);

  return (
    <RNModalize
      ref={ref}
      handlePosition={Platform.OS === 'ios' ? 'inside' : 'outside'}
      adjustToContentHeight
      modalStyle={[styles.modal, modalStyleProp]}
      {...modalizeProps}
    >
      <SafeAreaView edges={['bottom', 'left', 'right']} style={[styles.content, styleProp]}>
        {title && (
          <View style={styles.header}>
            <Text
              weight="bold"
              color="textSecondary"
              align="center"
              fontSize={18}
              style={styles.title}
            >
              {title}
            </Text>

            <Divider />
          </View>
        )}

        {children}
      </SafeAreaView>
    </RNModalize>
  );
});

Modalize.displayName = 'Modalize';
