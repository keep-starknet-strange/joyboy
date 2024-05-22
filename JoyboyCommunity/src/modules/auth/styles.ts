import {StyleSheet} from 'react-native';

const LOGO_SIZE = 170;

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },

  middle: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
  },
  logoContainer: {
    position: 'relative',
    top: '-100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE / 2,
    resizeMode: 'contain',
  },
  logoImage: {
    position: 'absolute',
    top: (LOGO_SIZE / 2) * -1,
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderWidth: 5,
    borderColor: 'white',
    borderRadius: 999,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 24,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
});
