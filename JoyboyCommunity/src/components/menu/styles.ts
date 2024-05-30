import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {},

  outsideContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },

  outside: {
    width: '100%',
    height: '100%',
  },

  menuContainer: {
    position: 'absolute',
    zIndex: 1,
  },
  menu: {
    position: 'absolute',
    height: 'auto',
    gap: StyleSheet.hairlineWidth,
    backgroundColor: '#c3c3c3',
    borderRadius: 16,
    overflow: 'hidden',
  },

  menuItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemLabel: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
    color: '#14142c',
  },
});
