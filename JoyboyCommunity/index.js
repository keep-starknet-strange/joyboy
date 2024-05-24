import 'fast-text-encoding';
import './src/app/Shims';

import registerRootComponent from 'expo/build/launch/registerRootComponent';

import {Wrapper} from './src/app/Wrapper';

registerRootComponent(Wrapper);
