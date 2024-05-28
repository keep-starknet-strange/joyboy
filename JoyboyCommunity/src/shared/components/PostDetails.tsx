import {MaterialIcons, Octicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, Pressable, ScrollView, Text, View} from 'react-native';
import styled from 'styled-components/native';

import {RootStackNavigationProps} from '../../types';
import Comments from './Comments';
import {Icon} from './Post';

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

function PostDetails({route}) {
  const {post, event, repostedEvent, sourceUser} = route.params;
  const navigation = useNavigation<RootStackNavigationProps>();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleProfilePress = (userId?: string) => {
    if (userId) {
      navigation.navigate('UserDetail', {userId});
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
              <Pressable onPress={() => handleProfilePress(event?.pubkey)}>
                <Image
                  source={sourceUser ?? require('../../../assets/joyboy-logo.png')}
                  style={{width: 44, height: 44}}
                />
              </Pressable>
            </View>

            <View style={{gap: 4, flex: 1}}>
              <Text style={{color: 'black', fontWeight: '700'}}>{event?.pubkey}</Text>

              {post?.source && (
                <Image
                  source={{uri: post.source}}
                  style={{
                    width: '100%',

                    height: 200,
                    borderRadius: 8,
                    marginTop: 8,
                  }}
                />
              )}
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
          <Text style={{color: 'black', marginTop: 10}}>
            {repostedEvent?.content ? repostedEvent?.content : event?.content}
          </Text>
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
        <Comments event={event} />
      </PostDetailsCard>
    </ScrollView>
  );
}

export default PostDetails;
