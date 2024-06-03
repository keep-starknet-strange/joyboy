import {
  InputAccessoryView as RNInputAccessoryView,
  InputAccessoryViewProps,
  Platform,
  View,
} from 'react-native';

/**
 * Wrapper around RN's InputAccessoryView component.
 * On Android, InputAccessoryView is not supported.
 * So we need to render the children in a View instead.
 */
export const InputAccessoryView: React.FC<InputAccessoryViewProps> = ({children, ...props}) => {
  if (Platform.OS !== 'ios') {
    return <View {...props}>{children}</View>;
  }

  return <RNInputAccessoryView {...props}>{children}</RNInputAccessoryView>;
};
