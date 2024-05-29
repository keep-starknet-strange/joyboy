import {createStackNavigator} from '@react-navigation/stack';
import {Image, View} from 'react-native';

import {JoyboyIcon, UserIcon} from '../../assets/icons';
import PostDetails from '../../shared/components/PostDetails';
import Feed from '.';
import {styles} from './style';

const FeedStack = createStackNavigator();
function FeedStackScreen() {
  return (
    <FeedStack.Navigator>
      <FeedStack.Screen
        name="Feed"
        options={{
          title: '',
          headerLeft: () => (
            <View style={styles.headerInner}>
              <Image style={styles.headerImage} source={require('../../assets/joyboy-logo.png')} />
              <JoyboyIcon color="#14142C" width={96} height={16} />
            </View>
          ),
          headerRight: () => (
            <View style={{paddingRight: 20}}>
              <UserIcon color="#1E2F3D" width={32} height={32} />
            </View>
          ),
        }}
        component={Feed}
      />
      <FeedStack.Screen
        name="PostDetails"
        component={PostDetails}
        options={{
          title: 'Feed',
          headerLeft: () => null,
        }}
      />
    </FeedStack.Navigator>
  );
}

export default FeedStackScreen;
