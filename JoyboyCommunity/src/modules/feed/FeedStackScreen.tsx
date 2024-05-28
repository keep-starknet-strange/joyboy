import {createStackNavigator} from '@react-navigation/stack';
import PostDetails from '../../shared/components/PostDetails';
import Feed from '.';
import {View, Image} from 'react-native';
import {styles} from './style';
import JoyboyIcon from '../../assets/feed/title';
import UserIcon from '../../assets/feed/user';


const FeedStack = createStackNavigator();
function FeedStackScreen() {
  return (
    <FeedStack.Navigator>
      <FeedStack.Screen
        name="Feed"
        options={{
          headerStyle: {height: 200},
          header: () => (
            <View style={styles.header}>
              <View style={styles.headerInner}>
                <Image
                  style={styles.headerImage}
                  source={require('../../assets/joyboy-logo.png')}
                />
                <JoyboyIcon />
              </View>

              <UserIcon />
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
