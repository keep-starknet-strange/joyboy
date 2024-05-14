import { AppRegistry } from 'react-native';
import App from './App';
import { expo  } from './app.json';

AppRegistry.registerComponent(expo?.name, () => App);
registerRootComponent(App);
