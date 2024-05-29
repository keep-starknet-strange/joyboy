import {MaterialIcons, Octicons} from '@expo/vector-icons';
import {Image, Pressable, ScrollView, Text, View} from 'react-native';
import styled from 'styled-components/native';

import {useNote} from '../../hooks';
import Comments from '../../shared/components/Comments';
import {Icon} from '../../shared/components/Post';
import {PostDetailScreenProps} from '../../types';

const PostDetailsCard = styled(View)`
  background-color: #ffffff;
  margin-top: 20px;
  border-radius: 16px;
`;

const PostDetailsHeader = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #eff0f1;
  padding: 8px;
  margin-bottom: 20px;
`;

const PostLayout = styled(View)`
  flex-direction: row;
`;

export const InteractionContainer = styled(View)`
  margin-top: 30px;
  width: 100%;
  display: flex;
  gap: 8px;
  flex-direction: row;
  align-content: center;
  align-self: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  padding-bottom: 20px;
  border-bottom-color: #eff0f1;
`;

export const PostDetail: React.FC<PostDetailScreenProps> = ({navigation, route}) => {
  const {postId, post} = route.params;

  const {data: note = post} = useNote({noteId: postId});

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleProfilePress = () => {
    if (note?.pubkey) {
      navigation.navigate('Profile', {publicKey: note.pubkey});
    }
  };

  return (
    <ScrollView>
      <PostDetailsCard>
        <PostDetailsHeader>
          <Icon
            as={MaterialIcons}
            name="chevron-left"
            size={25}
            color="#406686"
            onPress={handleGoBack}
          />
          <Text style={{color: '#406686', fontWeight: '700', fontSize: 15}}>Conversation</Text>
          <Icon as={MaterialIcons} name="more-horiz" size={25} color="#406686" />
        </PostDetailsHeader>
        <View style={{padding: 10}}>
          <PostLayout>
            <View style={{marginRight: 10}}>
              <Pressable onPress={handleProfilePress}>
                <Image
                  source={require('../../../assets/joyboy-logo.png')}
                  style={{width: 44, height: 44}}
                />
              </Pressable>
            </View>

            <View style={{gap: 4, flex: 1}}>
              <Text style={{color: 'black', fontWeight: '700'}}>{note?.pubkey}</Text>
            </View>

            {/* TODO check tags if it's:
        quote
        repost
        reply  */}
            <Icon
              as={Octicons}
              name="heart"
              size={24}
              color="black"
              style={{alignSelf: 'center'}}
            />
          </PostLayout>
          <Text style={{color: 'black', marginTop: 10}}>{note?.content}</Text>
          <InteractionContainer>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Icon as={Octicons} name="comment" size={18} color="#406686" />
              <Text style={{color: '#406686', fontWeight: '500', fontSize: 11}}>16 comments</Text>
            </View>

            <Icon as={MaterialIcons} name="more-horiz" size={18} color="#406686" />
          </InteractionContainer>
        </View>

        <Comments event={note} />
      </PostDetailsCard>
    </ScrollView>
  );
};
