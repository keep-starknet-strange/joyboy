import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 999,
  },
  block: {
    width: '100%',
  },

  text: {
    color: '#14142C',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledText: {
    color: 'rgba(20, 20, 44, 0.5)',
  },
});
