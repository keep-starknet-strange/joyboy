import {View, ViewProps} from 'react-native';

import {useTheme} from '../../hooks';

export const RootScreenContainer: React.FC<ViewProps> = ({style, ...props}) => {
  const theme = useTheme();

  return <View style={[{flex: 1, backgroundColor: theme.colors.background}, style]} {...props} />;
};
