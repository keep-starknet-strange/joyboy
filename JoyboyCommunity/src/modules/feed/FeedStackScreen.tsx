import {createStackNavigator} from '@react-navigation/stack';

import PostDetails from '../../shared/components/PostDetails';
import Feed from '.';

const FeedStack = createStackNavigator();

function FeedStackScreen() {
  return (
    <FeedStack.Navigator>
      <FeedStack.Screen name="Feed" component={Feed} />
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
