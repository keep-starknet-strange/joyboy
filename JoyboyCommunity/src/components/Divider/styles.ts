import {ThemedStyleSheet} from '../../styles';

export default ThemedStyleSheet((theme, color: string, thickness: number) => ({
  divider: {
    backgroundColor: color,
  },

  horizontal: {
    width: '100%',
    height: thickness,
  },
  vertical: {
    width: thickness,
    height: '100%',
  },
}));
