import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  storyText: {
    fontWeight: '400',
    fontSize: 16,
    paddingTop: 5,
    lineHeight: 20,
  },
  header: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
  },

  headerInner: {
    paddingLeft: 20,
    flex: 1,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    height: 58,
  },

  headerImage: {
    width: 36,
    height: 36,
    borderRadius: 50,
  },
});
