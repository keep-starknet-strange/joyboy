import {StyleSheet, View, ViewProps} from 'react-native';

import {useColor, useStyles} from '../../hooks';
import {ColorProp} from '../../styles';
import stylesheet from './styles';

export type DividerProps = ViewProps & {
  /**
   * Whether the divider is horizontal or vertical.
   * @default 'horizontal'
   */
  direction?: 'horizontal' | 'vertical';

  /**
   * The color of the divider.
   * @default 'divider'
   */
  color?: ColorProp;

  /**
   * The thickness of the divider.
   * @default hairlineWidth
   */
  thickness?: number;
};

export const Divider: React.FC<DividerProps> = (props) => {
  const {
    color: colorProp = 'divider',
    direction = 'horizontal',
    thickness = StyleSheet.hairlineWidth,
    style: styleProp,
    ...viewProps
  } = props;

  const color = useColor(colorProp);

  const styles = useStyles(stylesheet, color, thickness);

  return <View style={[styles.divider, styles[direction], styleProp]} {...viewProps} />;
};
