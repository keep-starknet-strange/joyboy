import {memo} from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {SafeAreaView, SafeAreaViewProps} from 'react-native-safe-area-context';

import {InputAccessoryView} from './InputAccessoryView';

export type KeyboardFixedViewProps = ViewProps & {
  containerProps?: SafeAreaViewProps;
};

const KeyboardFixedViewComponent: React.FC<KeyboardFixedViewProps> = (props) => {
  const {containerProps, style: styleProp, children, ...viewProps} = props;

  return (
    <SafeAreaView
      edges={['bottom']}
      {...containerProps}
      style={[styles.container, containerProps?.style]}
    >
      <InputAccessoryView style={styles.container}>
        <View style={[styles.container, styleProp]} {...viewProps}>
          {children}
        </View>
      </InputAccessoryView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export const KeyboardFixedView = memo(KeyboardFixedViewComponent);
