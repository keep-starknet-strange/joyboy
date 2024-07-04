import {Platform, View, ViewProps} from 'react-native';

import {WEB_MAX_WIDTH} from '../../constants/misc';
import {useStyles} from '../../hooks';
import {ThemedStyleSheet} from '../../styles';

export const RootScreenContainer: React.FC<ViewProps> = ({style, children, ...props}) => {
  const styles = useStyles(stylesheet);

  return (
    <View style={[styles.container, style]} {...props}>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const stylesheet = ThemedStyleSheet((theme) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },

  content: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? WEB_MAX_WIDTH : '100%',
  },
}));
