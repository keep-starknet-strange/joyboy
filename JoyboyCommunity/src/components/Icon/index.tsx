import {SvgProps} from 'react-native-svg';

import * as Icons from '../../assets/icons';
import {useColor} from '../../hooks';
import {ColorProp} from '../../styles';

export type IconNames = keyof typeof Icons;

export type IconProps = SvgProps & {
  name: IconNames;
  size?: number;
  color?: ColorProp;
};

export const Icon: React.FC<IconProps> = ({name, size, color: colorProp = 'text', ...props}) => {
  const color = useColor(colorProp);

  const IconComponent = Icons[name];

  return <IconComponent width={size} height={size} color={color} {...props} />;
};
