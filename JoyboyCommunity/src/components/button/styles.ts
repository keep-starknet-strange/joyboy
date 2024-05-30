import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0C0C4F',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 999,
  },
  small: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  block: {
    width: '100%',
  },
  disabled: {
    backgroundColor: 'rgba(12, 12, 79, 0.1)',
  },

  text: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  disabledText: {
    color: 'rgba(20, 20, 44, 0.5)',
  },
});
