import {View} from 'react-native';

import {ErrorIcon, InfoIcon, SuccessIcon} from '../../assets/icons';
import {useStyles, useTheme} from '../../hooks';
import {IconButton} from '../IconButton';
import {Text} from '../Text';
import stylesheet from './styles';

export type ToastProps = {
  type: 'success' | 'info' | 'error';
  title: string;
};

export const Toast: React.FC<ToastProps & {onDismiss?: () => void}> = ({
  type,
  title,
  onDismiss,
}) => {
  const theme = useTheme();
  const styles = useStyles(stylesheet, type);

  const color = (
    {
      success: 'successDark',
      info: 'infoDark',
      error: 'errorDark',
    } as const
  )[type];

  const Icon = (
    {
      success: SuccessIcon,
      info: InfoIcon,
      error: ErrorIcon,
    } as const
  )[type];

  return (
    <View style={styles.container}>
      <Icon width={20} height={20} color={theme.colors[color]} />

      <Text weight="semiBold" color={color} fontSize={14} style={styles.text}>
        {title}
      </Text>

      <IconButton
        icon="CloseIcon"
        size={20}
        color="textStrong"
        style={styles.closeIcon}
        onPress={onDismiss}
      />
    </View>
  );
};
