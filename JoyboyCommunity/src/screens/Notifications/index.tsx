import {Button, View} from 'react-native';

import {Divider, LayoutContainer, ScrollableContainer} from '../../components';
import {testPostData} from '../../shared/data/testData';
import {Notification} from './Notification';
import {Container} from './styled';
import {useNavigation} from '@react-navigation/native';
import {MainStackNavigationProps} from '../../types';

export const Notifications: React.FC = () => {
  const navigator = useNavigation<MainStackNavigationProps>();
  const Dialogpage = () => {
    navigator.push('DialogPage');
  };
  return (
    <LayoutContainer title="Notifications">
      <ScrollableContainer
        contentContainerStyle={{
          // width: "100%"
          width: '100%',
          flex: 1,
        }}
      >
        <Container>
          {testPostData.map((post, i) => (
            <View key={post.id} style={{gap: 12}}>
              <Notification
                post={{
                  author: post?.pubkey,
                  content: post?.content,
                  username: post?.pubkey,
                  id: post?.id,
                }}
              />
              <Divider />
            </View>
          ))}
          <Button title={'Click to go to Dialog page'} onPress={Dialogpage} />
        </Container>
      </ScrollableContainer>
    </LayoutContainer>
  );
};
